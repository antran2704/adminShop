import { useRouter } from "next/router";
import { useState, useEffect, Fragment, ReactElement, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import {
  IProduct,
  IParentCategory,
  IVariantProduct,
  ICreateProduct,
  IResponse,
  FileType,
  IOptionProduct,
  IResponseWithPagination,
} from "~/interface";

import FormLayout from "~/layouts/FormLayout";
import Loading from "~/components/Loading";
import Popup from "~/components/Popup";
import {
  createVariations,
  deleteProduct,
  getProduct,
  getVariations,
  updateProduct,
  updateVariations,
  uploadThumbnailProduct,
} from "~/api-client";
import LayoutWithHeader from "~/layouts/Private";
import { NextPageWithLayout } from "~/interface/page";
import { ProductForm, VariantProductForm } from "~/components/ProductPage";
import { array, object, string } from "yup";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { message, TabsProps, UploadFile } from "antd";
import Tabs from "~/components/Core/Tabs";
import { ORDER_PARAMATER_ENUM } from "~/enums";

const initData: ICreateProduct = {
  title: "",
  description: "",
  meta_description: "",
  meta_title: "",
  shortDescription: "",
  category: "",
  categories: [],
  price: 0,
  promotion_price: 0,
  inventory: 0,
  public: true,
  thumbnail: null,
  gallery: [],
  hotProduct: false,
  options: [],
  specifications: [],
  variations: [],
  sku: null,
  barcode: null,
  sold: 0,
};

const Layout = LayoutWithHeader;

const ProductEditPage: NextPageWithLayout = () => {
  const router = useRouter();
  const productId = router.query.id as string;

  const t = useTranslations("ProductPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const [selectTab, setSelectTab] = useState<string>("2");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      title: string().trim().required(tError("PLEASE_INPUT")),
      shortDescription: string().trim().required(tError("PLEASE_INPUT")),
      description: string().trim().required(tError("PLEASE_INPUT")),
      categories: array().min(1, tError("PLEASE_SELECT")),
      category: string().trim().required(tError("PLEASE_SELECT")),
      thumbnail: string().required(tError("PLEASE_UPLOAD")),
    });
  }, [router.locale]);

  // form control
  const productForm = useForm<ICreateProduct>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });
  const [product, setProduct] = useState<IProduct | null>(null);
  const [galleryFile, setGalleryFile] = useState<UploadFile[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const [variants, setVariants] = useState<IVariantProduct[]>([]);
  const [optionsProduct, setOptionsProduct] = useState<IOptionProduct[]>([]);
  const [removeVariants, setRemoveVariants] = useState<string[]>([]);

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  const onSelectTab = (value: string) => {
    setSelectTab(value);
  };

  const handleChangeOption = (items: IOptionProduct[]) => {
    setOptionsProduct(items);
  };

  const handleChangeVariants = (items: IVariantProduct[]) => {
    console.log(items);
    setVariants(items);
  };

  const handleRemoveVariant = (items: string[]) => {
    setRemoveVariants(items);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!productId) return;

    try {
      await deleteProduct(productId);
      setShowPopup(false);

      toast.success("Success delete product", {
        position: toast.POSITION.TOP_RIGHT,
      });

      router.push("/products");
    } catch (error) {
      toast.error("Error delete product", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onSubmitUpdateProduct = async (
    productId: string,
    values: ICreateProduct,
  ) => {
    // console.log("option", optionsProduct);
    // console.log("variant", variants);
    // console.log("remopve", removeVariants);

    // return;

    if (!productId) return;
    setIsSubmit(true);

    try {
      let variations_id: string[] = [];
      let inventory: number = values.inventory;

      if (removeVariants.length > 0) {
        await updateVariations(removeVariants);
      }

      if (variants.length > 0) {
        const variationsRes = await createVariations(
          productId as string,
          variants,
        );

        if (variationsRes.status !== 201) {
          toast.error("Error in updated variations", {
            position: toast.POSITION.TOP_RIGHT,
          });

          return;
        }

        variations_id = variationsRes.payload.map(
          (item: IVariantProduct) => item._id,
        );

        inventory = variationsRes.payload.reduce(
          (total: number, item: IVariantProduct) => {
            return total + item.inventory;
          },
          0,
        );
      }

      const dataSend: ICreateProduct = {
        ...values,
        variations: variations_id,
        options: optionsProduct,
        inventory,
      };

      if (!!galleryFile.length) {
        for (const item of galleryFile) {
          if (product?.gallery?.includes(item.name as string)) continue;

          const formData: FormData = new FormData();
          formData.append("image", item as FileType);

          const res: IResponse<string> = await uploadThumbnailProduct(formData);

          if (res.status === 201) {
            dataSend.gallery.push(res.payload);
          }
        }
      }

      const payload = await updateProduct(productId, dataSend);

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        // router.push("/products");
      }
    } catch (error) {
      messageApi.error("TRY_AGAIN");
    }

    setIsSubmit(false);
  };

  const handleGetData = async (id: string) => {
    setLoading(true);

    try {
      const { payload, status }: IResponse<IProduct> = await getProduct(
        id as string,
      );

      if (status === 200) {
        const { breadcrumbs, category, categories, ...restProduct } = payload;

        const formData: ICreateProduct = {
          ...restProduct,
          category: category._id,
          categories: categories.map((item: IParentCategory) => item._id),
        };

        const gallery: UploadFile[] = payload.gallery.map((item: string) => ({
          uid: uuidv4(),
          name: item,
          url: process.env.NEXT_PUBLIC_IMAGE_ENDPOINT + item,
        }));

        setProduct(payload);
        setGalleryFile(gallery);
        // setVariants(payload.variations);

        productForm.reset(formData);
      }

      setLoading(false);
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  // Get list variant of product
  const handleGetVariantsProduct = async (productId: string) => {
    getVariations(productId, {
      order: ORDER_PARAMATER_ENUM.DESC,
      page: 1,
      take: 16,
    }).then((res: IResponseWithPagination<IVariantProduct[]>) => {
      // console.log("variant", res);
      setVariants(res.payload);
    });
  };

  const onUploadGallery = async (file: UploadFile | null) => {
    if (!file) return;

    setGalleryFile([...galleryFile, file]);
  };

  const onRemoveGallary = async (file: UploadFile | null) => {
    if (!file) return;

    const newListFile: UploadFile[] = galleryFile.filter(
      (item: UploadFile) => item.uid !== file.uid,
    );

    if (product?.gallery?.includes(file.name as string)) {
      const newGallery: string[] = productForm
        .getValues("gallery")
        .filter((item) => item !== file.name);

      productForm.setValue("gallery", newGallery);
    }

    setGalleryFile(newListFile);
  };

  useEffect(() => {
    if (!productId) return;

    handleGetData(productId);
    handleGetVariantsProduct(productId);
  }, [productId, router.isReady]);

  const tabItems: TabsProps["items"] = useMemo(
    (): TabsProps["items"] => [
      {
        key: "1",
        label: t("tabs.infomation"),
        children: product && (
          <ProductForm
            form={productForm}
            data={product}
            galleryFile={galleryFile}
            onUploadGallery={onUploadGallery}
            onRemoveGallery={onRemoveGallary}
          />
        ),
      },
      {
        key: "2",
        label: t("tabs.variants"),
        children: product && (
          <VariantProductForm
            variants={variants}
            options={optionsProduct}
            removeVariants={removeVariants}
            product={product}
            handleChangeOption={handleChangeOption}
            handleChangeVariants={handleChangeVariants}
            handleRemoveVariant={handleRemoveVariant}
          />
        ),
      },
    ],
    [router.locale, product, variants, optionsProduct, removeVariants],
  );

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <FormLayout
      title={`${t("edit")}`}
      backLink="/products"
      onSubmit={productForm.handleSubmit((values) =>
        onSubmitUpdateProduct(productId, values),
      )}
      loading={isSubmit}>
      <Fragment>
        <Tabs activeKey={selectTab} items={tabItems} onChange={onSelectTab} />

        {showPopup && (
          <Popup
            title="Xác nhận xóa sản phẩm"
            img="/popup/trash.svg"
            show={showPopup}
            onClose={handlePopup}>
            <div>
              <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-2">
                <button
                  onClick={handlePopup}
                  className="lg:w-fit w-full text-lg font-medium bg-[#e2e2e2] px-5 py-1 opacity-90 hover:opacity-100 rounded-md transition-cus">
                  {t("Action.cancle")}
                </button>
                <button
                  onClick={() => handleDeleteProduct(productId)}
                  className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 opacity-90 hover:opacity-100 rounded-md">
                  {t("Action.delete")}
                </button>
              </div>
            </div>
          </Popup>
        )}

        {/* Message of Antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default ProductEditPage;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

ProductEditPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import { useRouter } from "next/router";
import { useState, useEffect, Fragment, ReactElement, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  IProduct,
  IParentCategory,
  IVariantProduct,
  ICreateProduct,
  IResponse,
  FileType,
  IOptionProduct,
  IResponseWithPagination,
  ICreateVariant,
} from "~/interface";

import FormLayout from "~/layouts/FormLayout";
import Loading from "~/components/Loading";
import Popup from "~/components/Popup";
import {
  createVariations,
  deleteAllVariationsInProduct,
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
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import FormFooter from "~/components/Footer/FormFooter";

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
  sku: null,
  barcode: null,
  sold: 0,
};

const Layout = LayoutWithHeader;

const ProductEditPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { query } = router;
  const productId = query.id as string;
  const tabParam = query.tab as string;

  const t = useTranslations("ProductPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const [selectTab, setSelectTab] = useState<string>(tabParam ? tabParam : "1");

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
  const [isRemoveAll, setIsRemoveAll] = useState<boolean>(false);

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  const onSelectTab = (value: string) => {
    setSelectTab(value);

    router.replace({
      query: { ...router.query, tab: value },
    });
  };

  const handleChangeOption = (items: IOptionProduct[]) => {
    setOptionsProduct(items);
  };

  const handleChangeVariants = (items: IVariantProduct[]) => {
    setVariants(items);
  };

  const onRemoveAllVariant = (value: boolean) => {
    setIsRemoveAll(value);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!productId) return;

    try {
      await deleteProduct(productId);
      setShowPopup(false);

      messageApi.success(tSuccess("delete"));

      router.push("/products");
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onSubmitUpdateProduct = async (
    productId: string,
    values: ICreateProduct,
  ) => {
    if (!productId) return;
    setIsSubmit(true);

    try {
      let inventory: number = 0;

      if (isRemoveAll) {
        await deleteAllVariationsInProduct(productId);
      }

      if (variants.length > 0) {
        let res: IResponse<{ inventory: number }>;

        if (isRemoveAll) {
          const parseData: ICreateVariant[] = variants.map((item) => {
            const { _id, ...rest } = item;
            return rest;
          });

          res = await createVariations(productId as string, parseData);
        } else {
          res = await updateVariations(productId as string, variants);
        }

        inventory = res.payload.inventory;
      } else {
        inventory = values.inventory;
      }

      const dataSend: ICreateProduct = {
        ...values,
        options: optionsProduct,
        inventory,
      };

      const payload = await updateProduct(productId, dataSend);

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        handleGetData(productId);
      }
    } catch (error) {
      messageApi.error("TRY_AGAIN");
    }

    setIsSubmit(false);
  };

  const handleGetData = async (id: string) => {
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
          url: item,
        }));

        setProduct(payload);
        setGalleryFile(gallery);
        setOptionsProduct(payload.options);
        productForm.reset(formData);
      }
    } catch (error) {
      const { status } = hanldeErrorAxios(error);

      if (status === 404) {
        router.push("/products");
      } else {
        messageApi.error(tError("TRY_AGAIN"));
      }
    }
  };

  // Get list variant of product
  const handleGetVariantsProduct = async (productId: string) => {
    getVariations(productId, {
      order: ORDER_PARAMATER_ENUM.DESC,
      page: 1,
      take: 16,
    }).then((res: IResponseWithPagination<IVariantProduct[]>) => {
      setVariants(res.payload);
    });
  };

  const onUploadGallery = async (file: UploadFile | null) => {
    if (!file) return;
    const formData: FormData = new FormData();
    formData.append("image", file as FileType);

    uploadThumbnailProduct(formData)
      .then((res: IResponse<string>) => {
        if (res.status === 201) {
          const gallery: string[] = productForm.getValues("gallery");
          productForm.setValue("gallery", [...gallery, res.payload]);
          product &&
            setProduct({
              ...product,
              gallery: [...product.gallery, res.payload],
            });
        }
      })
      .catch((err) => err);
  };

  const onRemoveGallary = async (file: UploadFile | null) => {
    if (!file) return;

    if (product?.gallery?.includes(file.name as string)) {
      const newGallery: string[] = productForm
        .getValues("gallery")
        .filter((item) => item !== file.name);

      setProduct({ ...product, gallery: newGallery });
      productForm.setValue("gallery", newGallery);
    }
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
            disableEditInventory={!!variants.length}
            product={product}
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
            product={product}
            onRemoveAll={onRemoveAllVariant}
            handleChangeOption={handleChangeOption}
            handleChangeVariants={handleChangeVariants}
          />
        ),
      },
    ],
    [
      router.locale,
      product,
      productForm.formState.errors,
      variants,
      optionsProduct,
    ],
  );

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <FormLayout
      title={`${t("edit")}`}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/products",
        },
        {
          title: t("breadcrumb.update"),
        },
      ]}
      loading={!product}>
      <Fragment>
        <Tabs activeKey={selectTab} items={tabItems} onChange={onSelectTab} />

        <FormFooter
          onCancel={() => router.push("/products")}
          onOk={productForm.handleSubmit((values) =>
            onSubmitUpdateProduct(productId, values),
          )}
          okProps={{
            loading: isSubmit,
            disabled: isSubmit,
          }}
        />

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

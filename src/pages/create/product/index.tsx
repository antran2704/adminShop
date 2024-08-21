import { useRouter } from "next/router";
import { ReactElement, useMemo, Fragment, useState } from "react";
import { array, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { message, UploadFile } from "antd";
import { useTranslations } from "next-intl";

import { FileType, ICreateProduct, IResponse } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import FormLayout from "~/layouts/FormLayout";
import PrivateLayout from "~/layouts/Private";

import { ProductForm } from "~/components/ProductPage";
import { createProduct, uploadThumbnailProduct } from "~/api-client";
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

const Layout = PrivateLayout;

const CreateProductPage: NextPageWithLayout = () => {
  const router = useRouter();

  const t = useTranslations("ProductPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

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

  const [galleryFile, setGalleryFile] = useState<UploadFile[]>([]);

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onUploadGallery = async (file: UploadFile | null) => {
    if (!file) return;

    setGalleryFile([...galleryFile, file]);
  };

  const onRemoveGallary = async (file: UploadFile | null) => {
    if (!file) return;

    const newListFile: UploadFile[] = galleryFile.filter(
      (item: UploadFile) => item.uid !== file.uid,
    );

    setGalleryFile(newListFile);
  };

  const handleOnSubmit = async (values: ICreateProduct) => {
    setIsSubmit(true);

    try {
      const dataSend: ICreateProduct = values;

      if (!!galleryFile.length) {
        for (const item of galleryFile) {
          const formData: FormData = new FormData();
          formData.append("image", item as FileType);

          const res: IResponse<string> = await uploadThumbnailProduct(formData);

          if (res.status === 201) {
            dataSend.gallery.push(res.payload);
          }
        }
      }

      const payload = await createProduct(values);

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        router.push("/products");
      }
    } catch (error) {
      messageApi.error("TRY_AGAIN");
      setIsSubmit(false);
    }
  };

  return (
    <FormLayout
      title={t("create")}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/products",
        },
        {
          title: t("breadcrumb.create"),
        },
      ]}>
      <Fragment>
        <ProductForm
          form={productForm}
          galleryFile={galleryFile}
          onUploadGallery={onUploadGallery}
          onRemoveGallery={onRemoveGallary}
        />

        <FormFooter
          onCancel={() => router.push("/products")}
          onOk={productForm.handleSubmit(handleOnSubmit)}
          okProps={{
            loading: isSubmit,
            disabled: isSubmit,
          }}
        />
        {/* Message of Antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default CreateProductPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CreateProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

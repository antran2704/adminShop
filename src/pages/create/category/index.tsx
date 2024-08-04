import { useRouter } from "next/router";
import { useState, ReactElement, useMemo, Fragment } from "react";
import { useTranslations } from "next-intl";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { message } from "antd";

import { ICreateCategory, IResponse } from "~/interface";
import { createCategory, uploadThumbnailCategory } from "~/api-client";

import LayoutWithHeader from "~/layouts/Private";
import FormLayout from "~/layouts/FormLayout";

import { CategoryForm } from "~/components/CategoryPage";
import { BreadcrumbCore } from "~/components/Core";

const initData: ICreateCategory = {
  parent_id: null,
  title: "",
  description: "",
  public: true,
  thumbnail: "",
  childrens: [],
};

const Layout = LayoutWithHeader;

const CreateCategoryPage = () => {
  const router = useRouter();

  const t = useTranslations("CategoryPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      title: string().trim().required(tError("PLEASE_INPUT")),
      description: string().trim().required(tError("PLEASE_INPUT")),
      thumbnail: string().required(tError("PLEASE_UPLOAD")),
      parent_id: string().required(tError("PLEASE_SELECT")),
    });
  }, [router.locale]);

  // form control
  const categoryForm = useForm<ICreateCategory>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const onChangeThumbnail = (source: File | null) => {
    setThumbnail(source);
  };

  const uploadThumbnail = async (source: File | null) => {
    if (!source) return;

    const formData: FormData = new FormData();
    formData.append("thumbnail", source);

    return await uploadThumbnailCategory(formData)
      .then((res: IResponse<string>) => res.payload)
      .catch(() => {
        messageApi.error(tError("UPLOAD_IMAGE"));
      });
  };

  const handleOnSubmit = async (values: ICreateCategory) => {
    setLoading(true);

    try {
      const image = await uploadThumbnail(thumbnail);

      if (!image) {
        setLoading(false);
        return;
      }

      const payload = await createCategory({
        ...values,
        thumbnail: image,
        parent_id: values.parent_id === "home" ? null : values.parent_id,
      });

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        router.push("/categories");
      }
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }

    setLoading(false);
  };

  return (
    <FormLayout
      title={t("create")}
      backLink="/categories"
      loading={loading}
      onSubmit={categoryForm.handleSubmit(handleOnSubmit)}>
      <Fragment>
        <BreadcrumbCore
          data={[
            {
              title: t("breadcrumb.list"),
              href: "/categories",
            },
            {
              title: t("breadcrumb.create"),
            },
          ]}
        />

        <CategoryForm
          form={categoryForm}
          onChangeThumbnail={onChangeThumbnail}
        />

        {/* Message of Antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default CreateCategoryPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CreateCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import { useRouter } from "next/router";
import { useState, ReactElement, useMemo, Fragment, useEffect } from "react";
import { useTranslations } from "next-intl";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { message } from "antd";

import { ICategory, ICreateCategory, IResponse } from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import {
  getCategory,
  updateCategory,
  uploadThumbnailCategory,
} from "~/api-client";
import { PrivateLayout } from "~/layouts";

import { CategoryForm } from "~/components/CategoryPage";
import { NextPageWithLayout } from "~/interface/page";
import { BreadcrumbCore } from "~/components/Core";
import FormFooter from "~/components/Footer/FormFooter";

const initData: ICreateCategory = {
  parent_id: null,
  title: "",
  description: "",
  public: true,
  thumbnail: "",
  children: [],
};
const Layout = PrivateLayout;

const EditCategoryPage: NextPageWithLayout = () => {
  const router = useRouter();
  const categoryId = router.query.id as string;

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

  const [category, setCategory] = useState<ICategory | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [loading, setLoading] = useState<{ getData: boolean; submit: boolean }>(
    { getData: true, submit: false },
  );

  const [messageApi, contextHolder] = message.useMessage();

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

  const handleGetCategory = async (categoryId: string) => {
    setLoading({ ...loading, getData: true });

    getCategory(categoryId)
      .then(({ payload }: IResponse<ICategory>) => {
        categoryForm.reset({
          children: payload.children,
          description: payload.description,
          title: payload.title,
          thumbnail: payload.thumbnail,
          parent_id: payload.parent_id ? payload.parent_id : "home",
          public: payload.public,
        });

        setCategory(payload);
        setLoading({ ...loading, getData: false });
      })
      .catch(() => {
        router.push("/categories");
      });
  };

  const handleOnSubmit = async (
    categoryId: string,
    values: ICreateCategory,
  ) => {
    if (!categoryId) return;

    setLoading({ ...loading, submit: true });

    try {
      let image: string = values.thumbnail;

      if (thumbnail) {
        image = (await uploadThumbnail(thumbnail)) as string;
      }

      if (!image) {
        setLoading({ ...loading, submit: false });
        return;
      }

      const payload = await updateCategory(categoryId, {
        ...values,
        thumbnail: image,
        parent_id: values.parent_id === "home" ? null : values.parent_id,
      });

      if (payload.status === 201) {
        messageApi.success(tSuccess("update"));
        router.push("/categories");
      }
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }

    setLoading({ ...loading, submit: false });
  };

  useEffect(() => {
    if (categoryId) {
      handleGetCategory(categoryId);
    }
  }, [categoryId]);

  return (
    <FormLayout title={t("edit")} loading={loading.getData}>
      <Fragment>
        <BreadcrumbCore
          data={[
            {
              title: t("breadcrumb.list"),
              href: "/categories",
            },
            {
              title: t("breadcrumb.update"),
            },
          ]}
        />

        {category && (
          <CategoryForm
            category={category}
            form={categoryForm}
            onChangeThumbnail={onChangeThumbnail}
          />
        )}

        <FormFooter
          onCancel={() => router.push("/categories")}
          onOk={categoryForm.handleSubmit((values) =>
            handleOnSubmit(categoryId, values),
          )}
          okProps={{
            loading: loading.submit,
            disabled: loading.submit,
          }}
        />

        {/* Message of Antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default EditCategoryPage;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

EditCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

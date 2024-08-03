import { useRouter } from "next/router";
import { useState, ReactElement, useMemo, Fragment, useEffect } from "react";

import { ICategory, ICreateCategory, IResponse } from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import generalBreadcrumbs from "~/helper/generateBreadcrumb";
import {
  createCategory,
  getCategory,
  updateCategory,
  uploadThumbnailCategory,
} from "~/api-client";
import LayoutWithHeader from "~/layouts/Private";
import { useTranslations } from "next-intl";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { CategoryForm } from "~/components/CategoryPage";
import { NextPageWithLayout } from "~/interface/page";
import Loading from "~/components/Loading";

const initData: ICreateCategory = {
  parent_id: null,
  title: "",
  description: "",
  public: true,
  thumbnail: "",
  childrens: [],
};
const Layout = LayoutWithHeader;

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

  const [loading, setLoading] = useState<boolean>(false);

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
    getCategory(categoryId)
      .then(({ payload }: IResponse<ICategory>) => {
        categoryForm.reset({
          childrens: payload.childrens,
          description: payload.description,
          title: payload.title,
          thumbnail: payload.thumbnail,
          parent_id: payload.parent_id ? payload.parent_id : "home",
          public: payload.public,
        });

        setCategory(payload);
      })
      .catch((err) => err);
  };

  const handleOnSubmit = async (
    categoryId: string,
    values: ICreateCategory,
  ) => {
    if (!categoryId) return;

    setLoading(true);

    try {
      let image: string = values.thumbnail;

      if (thumbnail) {
        image = (await uploadThumbnail(thumbnail)) as string;
      }

      if (!image) {
        setLoading(false);
        return;
      }

      // let breadcrumbs: string[] = generalBreadcrumbs(
      //   categorySelect.node_id || null,
      //   categories,
      // );

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

    setLoading(false);
  };

  useEffect(() => {
    if (categoryId) {
      handleGetCategory(categoryId);
    }
  }, [categoryId]);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <FormLayout
      title={t("edit")}
      backLink="/categories"
      loading={loading}
      onSubmit={categoryForm.handleSubmit((values) =>
        handleOnSubmit(categoryId, values),
      )}>
      <Fragment>
        {category && (
          <CategoryForm
            category={category}
            form={categoryForm}
            onChangeThumbnail={onChangeThumbnail}
          />
        )}

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

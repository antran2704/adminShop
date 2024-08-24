import { useRouter } from "next/router";
import { Fragment, ReactElement, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { message } from "antd";
import { object, string } from "yup";
import { useForm } from "react-hook-form";

import { NextPageWithLayout } from "~/interface/page";
import { IResponse } from "~/interface";

import FormLayout from "~/layouts/FormLayout";
import { PrivateLayout } from "~/layouts";
import FormFooter from "~/components/Footer/FormFooter";
import { ICreateBlogTag } from "~/interface/blog/blogTag";
import { createTagBlog, uploadTagBlogImage } from "~/api-client/blogs/tagBlog";
import FormBlogTag from "~/components/BlogTagPage/form";

const initData: ICreateBlogTag = {
  title: "",
  public: true,
  thumbnail: "",
};

const Layout = PrivateLayout;

const CreateBlogTagPage: NextPageWithLayout = () => {
  const router = useRouter();

  const t = useTranslations("BlogTagPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      title: string().trim().required(tError("PLEASE_INPUT")),
      thumbnail: string().required(tError("PLEASE_UPLOAD")),
    });
  }, [router.locale]);

  // form control
  const blogTagForm = useForm<ICreateBlogTag>({
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

    return await uploadTagBlogImage(formData)
      .then((res: IResponse<string>) => res.payload)
      .catch(() => {
        messageApi.error(tError("UPLOAD_IMAGE"));
        setLoading(false);
      });
  };

  const handleOnSubmit = async (values: ICreateBlogTag) => {
    setLoading(true);

    try {
      const image = await uploadThumbnail(thumbnail);
      if (!image) return;

      const payload = await createTagBlog({ ...values, thumbnail: image });

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        router.push("/blog-tag");
      }
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title={t("title")}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/blog-tag",
        },
        {
          title: t("breadcrumb.create"),
        },
      ]}>
      <Fragment>
        <FormBlogTag
          form={blogTagForm}
          handleChangeThumbnail={onChangeThumbnail}
        />

        <FormFooter
          onCancel={() => router.push("/blog-tag")}
          okProps={{
            loading,
            disabled: loading,
          }}
          onOk={blogTagForm.handleSubmit(handleOnSubmit)}
        />
        {/* Message of antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default CreateBlogTagPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CreateBlogTagPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

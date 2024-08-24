import { useRouter } from "next/router";
import { Fragment, ReactElement, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { message } from "antd";
import { array, object, string } from "yup";
import { useForm } from "react-hook-form";

import { NextPageWithLayout } from "~/interface/page";
import { IResponse } from "~/interface";
import { ICreateBlog } from "~/interface/blog";

import FormLayout from "~/layouts/FormLayout";
import { PrivateLayout } from "~/layouts";
import FormFooter from "~/components/Footer/FormFooter";
import { createBlog, uploadBlogImage } from "~/api-client/blogs";
import FormBlog from "~/components/BlogPage/form";

const initData: ICreateBlog = {
  title: "",
  description: "",
  meta_description: "",
  meta_title: "",
  public: true,
  thumbnail: "",
  content: "",
  tag: "",
  tags: [],
};

const Layout = PrivateLayout;

const CreateBlogPage: NextPageWithLayout = () => {
  const router = useRouter();

  const t = useTranslations("BlogPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      title: string().trim().required(tError("PLEASE_INPUT")),
      meta_title: string().trim().required(tError("PLEASE_INPUT")),
      description: string().trim().required(tError("PLEASE_INPUT")),
      meta_description: string().trim().required(tError("PLEASE_INPUT")),
      thumbnail: string().required(tError("PLEASE_UPLOAD")),
      content: string().min(10, tError("AT_LEAST_CHARACTERS", { number: 10 })),
      tags: array().min(1, tError("PLEASE_SELECT")),
      tag: string().trim().required(tError("PLEASE_INPUT")),
    });
  }, [router.locale]);

  // form control
  const blogForm = useForm<ICreateBlog>({
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
    formData.append("image", source);

    return await uploadBlogImage(formData)
      .then((res: IResponse<string>) => res.payload)
      .catch(() => {
        messageApi.error(tError("UPLOAD_IMAGE"));
        setLoading(false);
      });
  };

  const handleOnSubmit = async (values: ICreateBlog) => {
    setLoading(true);

    try {
      const image = await uploadThumbnail(thumbnail);
      if (!image) return;

      const payload = await createBlog({ ...values, thumbnail: image });

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        router.push("/blogs");
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
          href: "/blogs",
        },
        {
          title: t("breadcrumb.create"),
        },
      ]}>
      <Fragment>
        <FormBlog form={blogForm} handleChangeThumbnail={onChangeThumbnail} />

        <FormFooter
          onCancel={() => router.push("/blogs")}
          okProps={{
            loading,
            disabled: loading,
          }}
          onOk={blogForm.handleSubmit(handleOnSubmit)}
        />
        {/* Message of antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default CreateBlogPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CreateBlogPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

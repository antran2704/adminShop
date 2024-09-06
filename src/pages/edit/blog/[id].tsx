import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { message } from "antd";
import { array, object, string } from "yup";
import { useForm } from "react-hook-form";

import { NextPageWithLayout } from "~/interface/page";
import { IResponse } from "~/interface";
import { IBlog, ICreateBlog } from "~/interface/blog";

import FormLayout from "~/layouts/FormLayout";
import { PrivateLayout } from "~/layouts";
import FormFooter from "~/components/Footer/FormFooter";
import { getBlog, updateBlog, uploadBlogImage } from "~/api-client/blogs";
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

const EditBlogPage: NextPageWithLayout = () => {
  const router = useRouter();
  const blogId = router.query.id as string;

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
  const [blog, setBlog] = useState<IBlog | null>(null);

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

  const handleGetData = async (id: string) => {
    setLoading(true);

    getBlog(id)
      .then(({ payload }: IResponse<IBlog>) => {
        const data: ICreateBlog = {
          title: payload.title,
          meta_title: payload.meta_title,
          description: payload.description,
          meta_description: payload.meta_description,
          content: payload.content,
          thumbnail: payload.thumbnail,
          public: payload.public,
          tag: payload.tag._id,
          tags: payload.tags.map((item) => item._id),
        };

        blogForm.reset(data);

        setBlog(payload);
        setLoading(false);
      })
      .catch(() => router.push("/blogs"));
  };

  const handleOnSubmit = async (id: string, values: ICreateBlog) => {
    setLoading(true);

    try {
      let image: string = values.thumbnail;

      if (thumbnail) {
        image = (await uploadThumbnail(thumbnail)) as string;
      }

      if (!image) return;

      await updateBlog(id, { ...values, thumbnail: image });

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!blogId) {
      router.push("/blogs");
      return;
    }

    handleGetData(blogId);
  }, [blogId]);

  return (
    <FormLayout
      title={t("title")}
      loading={!blog}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/blogs",
        },
        {
          title: t("breadcrumb.update"),
        },
      ]}>
      <Fragment>
        {blog && (
          <FormBlog
            form={blogForm}
            data={blog}
            handleChangeThumbnail={onChangeThumbnail}
          />
        )}

        <FormFooter
          onCancel={() => router.push("/blogs")}
          okProps={{
            loading,
            disabled: loading,
          }}
          onOk={blogForm.handleSubmit((values) =>
            handleOnSubmit(blogId, values),
          )}
        />
        {/* Message of antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default EditBlogPage;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

EditBlogPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useMemo, useState } from "react";
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
import { IBlogTag, ICreateBlogTag } from "~/interface/blog/blogTag";
import {
  createTagBlog,
  getTagBlog,
  updateTagBlog,
  uploadTagBlogImage,
} from "~/api-client/blogs/tagBlog";
import FormBlogTag from "~/components/BlogTagPage/form";

const initData: ICreateBlogTag = {
  title: "",
  public: true,
  thumbnail: "",
};

const Layout = PrivateLayout;

const CreateCategoryPage: NextPageWithLayout = () => {
  const router = useRouter();
  const blogTagId = router.query.id as string;

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

  const [blogTag, setBlogTag] = useState<IBlogTag | null>(null);

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

  const handleGetData = async (id: string) => {
    setLoading(true);

    getTagBlog(id)
      .then(({ status, payload }: IResponse<IBlogTag>) => {
        if (status === 200) {
          blogTagForm.reset({
            thumbnail: payload.thumbnail,
            title: payload.title,
            public: payload.public,
          });
        }

        setBlogTag(payload);
        setLoading(false);
      })
      .catch(() => router.push("/blog-tag"));
  };

  const handleOnSubmit = async (id: string, values: ICreateBlogTag) => {
    if (!id) return;

    setLoading(true);

    try {
      let image: string = values.thumbnail;

      if (thumbnail) {
        image = (await uploadThumbnail(thumbnail)) as string;
      }

      if (!image) return;

      const payload = await updateTagBlog(id, { ...values, thumbnail: image });

      if (payload.status === 201) {
        messageApi.success(tSuccess("update"));
        router.push("/blog-tag");
      }
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!blogTagId) {
      router.push("/blog-tag");
      return;
    }

    handleGetData(blogTagId);
  }, [blogTagId]);

  return (
    <FormLayout
      title={t("title")}
      loading={loading}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/blog-tag",
        },
        {
          title: t("breadcrumb.update"),
        },
      ]}>
      <Fragment>
        {blogTag && (
          <FormBlogTag
            form={blogTagForm}
            data={blogTag}
            handleChangeThumbnail={onChangeThumbnail}
          />
        )}

        <FormFooter
          onCancel={() => router.push("/blog-tag")}
          okProps={{
            loading,
            disabled: loading,
          }}
          onOk={blogTagForm.handleSubmit((values) =>
            handleOnSubmit(blogTagId, values),
          )}
        />
        {/* Message of antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default CreateCategoryPage;

export async function getServerSideProps(context: { locale: string }) {
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

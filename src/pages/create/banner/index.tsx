import { useRouter } from "next/router";
import { Fragment, ReactElement, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { message } from "antd";
import { object, string } from "yup";
import { useForm } from "react-hook-form";

import { createBanner, uploadBannerImage } from "~/api-client";

import { NextPageWithLayout } from "~/interface/page";
import { ICreateBanner, IResponse } from "~/interface";

import FormLayout from "~/layouts/FormLayout";
import LayoutWithHeader from "~/layouts/Private";
import FormBanner from "~/components/BannerPage/form";
import { BreadcrumbCore } from "~/components/Core";

const initData: ICreateBanner = {
  title: "",
  meta_title: "",
  public: true,
  image: "",
  path: null,
};

const Layout = LayoutWithHeader;

const CreateCategoryPage: NextPageWithLayout = () => {
  const router = useRouter();

  const t = useTranslations("BannerPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      title: string().trim().required(tError("PLEASE_INPUT")),
      meta_title: string().trim().required(tError("PLEASE_INPUT")),
      image: string().required(tError("PLEASE_UPLOAD")),
    });
  }, [router.locale]);

  // form control
  const bannerForm = useForm<ICreateBanner>({
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

    return await uploadBannerImage(formData)
      .then((res: IResponse<string>) => res.payload)
      .catch(() => {
        messageApi.error(tError("UPLOAD_IMAGE"));
      });
  };

  const handleOnSubmit = async (values: ICreateBanner) => {
    setLoading(true);

    try {
      const image = await uploadThumbnail(thumbnail);

      if (!image) return;

      const payload = await createBanner({ ...values, image });

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        router.push("/banners");
      }
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title={t("title")}
      backLink="/banners"
      loading={loading}
      breadcrumb={
        <BreadcrumbCore
          data={[
            {
              title: t("breadcrumb.list"),
              href: "/banners",
            },
            {
              title: t("breadcrumb.create"),
            },
          ]}
        />
      }
      onSubmit={bannerForm.handleSubmit(handleOnSubmit)}>
      <Fragment>
        <FormBanner
          form={bannerForm}
          handleChangeThumbnail={onChangeThumbnail}
        />

        {/* Message of antd */}
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

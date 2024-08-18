import { useRouter } from "next/router";
import { useState, useEffect, Fragment, ReactElement, useMemo } from "react";
import { useTranslations } from "next-intl";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

import FormLayout from "~/layouts/FormLayout";
import Loading from "~/components/Loading";
import LayoutWithHeader from "~/layouts/Private";
import FormBanner from "~/components/BannerPage/form";

import { getBanner, updateBanner, uploadBannerImage } from "~/api-client";

import { IBanner, ICreateBanner, IResponse } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import { EPermission, ERole } from "~/enums";

import useAbility from "~/hooks/useAbility";
import FormFooter from "~/components/Footer/FormFooter";

const initData: ICreateBanner = {
  title: "",
  meta_title: "",
  public: true,
  image: "",
  path: null,
};

const Layout = LayoutWithHeader;

const EditCategoryPage: NextPageWithLayout = () => {
  const router = useRouter();
  const bannerId = router.query.id as string;

  const t = useTranslations("BannerPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const { isCan, abilityLoading } = useAbility(
    [ERole.ADMIN],
    [EPermission.ADMIN],
  );

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

  const [banner, setBanner] = useState<IBanner | null>(null);

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

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

  const handleGetData = async (id: string) => {
    setLoading(true);

    getBanner(id)
      .then(({ status, payload }: IResponse<IBanner>) => {
        if (status === 200) {
          bannerForm.reset({
            image: payload.image,
            title: payload.title,
            meta_title: payload.meta_title,
            path: payload.path,
            public: payload.public,
          });
        }

        setBanner(payload);
        setLoading(false);
      })
      .catch(() => router.push("/banners"));
  };

  const handleOnSubmit = async (values: ICreateBanner) => {
    if (!bannerId) return;
    setLoadingSubmit(true);

    try {
      let image: string = values.image;

      if (thumbnail) {
        image = (await uploadThumbnail(thumbnail)) as string;
      }

      if (!image) return;

      const payload = await updateBanner(bannerId, { ...values, image });

      if (payload.status === 201) {
        messageApi.success(tSuccess("update"));
        router.push("/banners");
      }
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    if (!bannerId || !isCan || abilityLoading) return;

    handleGetData(bannerId);
  }, [bannerId, router.isReady, isCan, abilityLoading]);

  useEffect(() => {
    if (!isCan && !abilityLoading) {
      router.push("/banners");
    }
  }, [isCan, abilityLoading]);

  if (!router.isReady || abilityLoading) {
    return <Loading />;
  }

  return (
    <FormLayout
      title={t("edit")}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/banners",
        },
        {
          title: t("breadcrumb.update"),
        },
      ]}
      loading={loading}>
      <Fragment>
        {banner && (
          <FormBanner
            form={bannerForm}
            banner={banner}
            handleChangeThumbnail={onChangeThumbnail}
          />
        )}

        <FormFooter
          onCancel={() => router.push("/banners")}
          onOk={bannerForm.handleSubmit(handleOnSubmit)}
          okProps={{
            loading: loadingSubmit,
            disabled: loadingSubmit,
          }}
        />

        {/* Message of antd */}
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

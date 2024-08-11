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
import { BreadcrumbCore } from "~/components/Core";

import { getBanner, updateBanner, uploadBannerImage } from "~/api-client";

import { IBanner, ICreateBanner, IResponse } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import { EPermission, ERole } from "~/enums";

import useAbility from "~/hooks/useAbility";
import SpinLoading from "~/components/Loading/SpinLoading";

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

  const t = useTranslations("CreateBannerPage");
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

  const [messageApi, contextHolder] = message.useMessage();

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

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

    try {
      const { status, payload }: IResponse<IBanner> = await getBanner(id);

      if (status === 200) {
        bannerForm.reset({
          image: payload.image,
          title: payload.title,
          meta_title: payload.meta_title,
          path: payload.path,
          public: payload.public,
        });
      }

      setLoading(false);
    } catch (error) {
      router.push("/banners");
    }
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
      title={t("editTitle")}
      backLink="/banners"
      loading={loadingSubmit}
      onSubmit={bannerForm.handleSubmit(handleOnSubmit)}>
      <Fragment>
        <BreadcrumbCore
          data={[
            {
              title: t("breadcrumb.list"),
              href: "/banners",
            },
            {
              title: t("breadcrumb.update"),
            },
          ]}
        />

        <FormBanner
          form={bannerForm}
          handleChangeThumbnail={onChangeThumbnail}
        />

        {/* loading */}
        {!loading && (
          <div className="sticky bottom-0 w-full h-screen z-30">
            <SpinLoading className="text-3xl" />
          </div>
        )}

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

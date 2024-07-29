import { useRouter } from "next/router";
import { ReactElement, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";

import { createBanner, uploadBannerImage } from "~/api-client";

import { NextPageWithLayout } from "~/interface/page";
import { ICreateBanner } from "~/interface";

import FormLayout from "~/layouts/FormLayout";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import FormBanner from "~/components/BannerPage/form";

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

  const t = useTranslations("CreateBannerPage");
  const tError = useTranslations("Error");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      title: string().trim().required(tError("PLEASE_INPUT")),
      meta_title: string().trim().required(tError("PLEASE_INPUT")),
      projectImage: string().required(tError("PLEASE_UPLOAD")),
    });
  }, [router.locale]);

  // form control
  const bannerForm = useForm<ICreateBanner>({
    defaultValues: initData,
    // resolver: yupResolver(schema) as any,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

  const uploadThumbnail = async (source: File | null) => {
    if (!source) return;

    const formData: FormData = new FormData();
    formData.append("thumbnail", source);
    setLoadingThumbnail(true);

    try {
      const { status, payload } = await uploadBannerImage(formData);

      if (status === 201) {
        bannerForm.setValue("image", payload);
      }
    } catch (error) {
      toast.error("Upload image failed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoadingThumbnail(false);
  };

  const handleOnSubmit = async (values: ICreateBanner) => {
    setLoading(true);

    try {
      const payload = await createBanner(values);

      if (payload.status === 201) {
        toast.success("Success create banner", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/banners");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error in create category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title={t("title")}
      backLink="/banners"
      loading={loading}
      onSubmit={bannerForm.handleSubmit(handleOnSubmit)}>
      <FormBanner form={bannerForm} handleChangeThumbnail={uploadThumbnail} />
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

import { useRouter } from "next/router";
import { useState, ReactElement, useMemo } from "react";
import { toast } from "react-toastify";

import { ICreateCategory } from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import generalBreadcrumbs from "~/helper/generateBreadcrumb";
import { createCategory, uploadThumbnailCategory } from "~/api-client";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { useTranslations } from "next-intl";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { CategoryForm } from "~/components/CategoryPage";

const initData: ICreateCategory = {
  parent_id: null,
  title: "",
  description: "",
  meta_title: "",
  meta_description: "",
  public: true,
  thumbnail: "",
  childrens: [],
};

const Layout = LayoutWithHeader;

const CreateCategoryPage = () => {
  const router = useRouter();

  const t = useTranslations("CategoryPage");
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
  const categoryForm = useForm<ICreateCategory>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

  const uploadThumbnail = async (source: File) => {
    if (source) {
      const formData: FormData = new FormData();
      formData.append("thumbnail", source);
      setLoadingThumbnail(true);

      try {
        const { status, payload } = await uploadThumbnailCategory(formData);

        if (status === 201) {
          setThumbnail(payload);
          setLoadingThumbnail(false);
        }
      } catch (error) {
        toast.error("Upload thumbnail failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoadingThumbnail(false);
        console.log(error);
      }
    }
  };

  const handleOnSubmit = async () => {
    setLoading(true);

    try {
      let breadcrumbs: string[] = generalBreadcrumbs(
        categorySelect.node_id || null,
        categories,
      );

      const payload = await createCategory({
        title: data.title,
        description: data.description,
        meta_title: data.title,
        meta_description: data.description,
        parent_id: categorySelect.node_id,
        thumbnail,
        public: data.public,
        breadcrumbs,
      });

      if (payload.status === 201) {
        toast.success("Success create category", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/categories");
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
      title={t("create")}
      backLink="/categories"
      loading={loading}
      onSubmit={handleOnSubmit}>
      <CategoryForm form={categoryForm} handleChangeThumbnail={() => {}} />
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

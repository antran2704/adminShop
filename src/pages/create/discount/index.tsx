import { useRouter } from "next/router";
import { useState, ReactElement, Fragment, useMemo } from "react";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";

import FormLayout from "~/layouts/FormLayout";
import LayoutWithHeader from "~/layouts/Private";

import { ENUM_DISCOUNT_APPLIES, ENUM_DISCOUNT_TYPE } from "~/enums/discount";
import { NextPageWithLayout } from "~/interface/page";
import { ICreateDiscount } from "~/interface/discount";
import { IResponse } from "~/interface";

import {
  createDiscount,
  uploadDiscountThumbnail,
} from "~/api-client/discounts";

import { DiscountForm } from "~/components/DiscountPage";
import FormFooter from "~/components/Footer/FormFooter";

const initData: ICreateDiscount = {
  discount_code: "",
  discount_name: "",
  discount_value: 0,
  discount_applies: ENUM_DISCOUNT_APPLIES.ALL,
  discount_type: ENUM_DISCOUNT_TYPE.PERCENTAGE,
  discount_product_ids: [],
  discount_start_date: "",
  discount_end_date: "",
  discount_per_user: 0,
  discount_min_value: 0,
  discount_max_uses: 0,
  discount_thumbnail: "",
  discount_active: true,
  discount_public: true,
};

const Layout = LayoutWithHeader;

const CreateCouponPage: NextPageWithLayout = () => {
  const router = useRouter();
  const t = useTranslations("DiscountPage");
  const tSuccess = useTranslations("Success");
  const tError = useTranslations("Error");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      discount_name: string().trim().required(tError("PLEASE_INPUT")),
      discount_code: string().trim().required(tError("PLEASE_INPUT")),
      discount_start_date: string().trim().required(tError("PLEASE_INPUT")),
      discount_end_date: string().trim().required(tError("PLEASE_INPUT")),
      discount_thumbnail: string().required(tError("PLEASE_UPLOAD")),
    });
  }, [router.locale]);

  // form control
  const discountForm = useForm<ICreateDiscount>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState<{
    thumbnail: boolean;
    submit: boolean;
  }>({ thumbnail: false, submit: false });

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const onChangeThumbnail = (source: File | null) => {
    setThumbnail(source);
  };

  const uploadThumbnail = async (source: File | null) => {
    if (!source) return;

    const formData: FormData = new FormData();
    formData.append("thumbnail", source);

    return await uploadDiscountThumbnail(formData)
      .then((res: IResponse<string>) => res.payload)
      .catch(() => {
        messageApi.error(tError("UPLOAD_IMAGE"));
      });
  };

  const handleOnSubmit = async (values: ICreateDiscount) => {
    onLoading("submit", true);

    try {
      const image = await uploadThumbnail(thumbnail);

      if (!image) {
        onLoading("submit", false);
        return;
      }

      const payload = await createDiscount({
        ...values,
        discount_thumbnail: image,
      });

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        router.push("/discounts");
      }
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }

    onLoading("submit", false);
  };

  return (
    <FormLayout
      title={t("create")}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/discounts",
        },
        {
          title: t("breadcrumb.create"),
        },
      ]}>
      <Fragment>
        <DiscountForm
          form={discountForm}
          handleChangeThumbnail={onChangeThumbnail}
        />

        <FormFooter
          onCancel={() => router.push("/categories")}
          onOk={discountForm.handleSubmit(handleOnSubmit)}
          okProps={{
            loading: loading.submit,
            disabled: loading.submit,
          }}
        />
        {/* Message of Antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default CreateCouponPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CreateCouponPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

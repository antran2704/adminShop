import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { message } from "antd";
import { object, string } from "yup";
import { useForm } from "react-hook-form";

import {
  getDiscount,
  getDiscounts,
  updateDiscount,
  uploadDiscountThumbnail,
} from "~/api-client/discounts";

import { NextPageWithLayout } from "~/interface/page";
import { IResponse } from "~/interface";
import { ICreateDiscount, IDiscount } from "~/interface/discount";
import { ENUM_DISCOUNT_APPLIES, ENUM_DISCOUNT_TYPE } from "~/enums/discount";

import FormLayout from "~/layouts/FormLayout";
import { PrivateLayout } from "~/layouts";
import FormFooter from "~/components/Footer/FormFooter";
import { DiscountForm } from "~/components/DiscountPage";

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

const Layout = PrivateLayout;

const EditDiscountPage: NextPageWithLayout = () => {
  const router = useRouter();
  const discountId = router.query.id as string;

  const t = useTranslations("DiscountPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

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

  const [discount, setDiscount] = useState<IDiscount | null>(null);

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

    return await uploadDiscountThumbnail(formData)
      .then((res: IResponse<string>) => res.payload)
      .catch(() => {
        messageApi.error(tError("UPLOAD_IMAGE"));
        setLoading(false);
      });
  };

  const handleGetData = async (id: string) => {
    setLoading(true);

    getDiscount(id)
      .then(({ payload }: IResponse<IDiscount>) => {
        const data: ICreateDiscount = {
          discount_name: payload.discount_name,
          discount_code: payload.discount_code,
          discount_active: payload.discount_active,
          discount_public: payload.discount_public,
          discount_applies: payload.discount_applies,
          discount_end_date: payload.discount_end_date,
          discount_start_date: payload.discount_start_date,
          discount_max_uses: payload.discount_max_uses,
          discount_min_value: payload.discount_min_value,
          discount_per_user: payload.discount_per_user,
          discount_product_ids: payload.discount_product_ids,
          discount_thumbnail: payload.discount_thumbnail,
          discount_type: payload.discount_type,
          discount_value: payload.discount_value,
        };

        discountForm.reset(data);

        setDiscount(payload);
        setLoading(false);
      })
      .catch(() => router.push("/discounts"));
  };

  const handleOnSubmit = async (id: string, values: ICreateDiscount) => {
    setLoading(true);

    try {
      let image: string = values.discount_thumbnail;

      if (thumbnail) {
        image = (await uploadThumbnail(thumbnail)) as string;
      }

      if (!image) return;

      await updateDiscount(id, { ...values, discount_thumbnail: image });

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!discountId) {
      router.push("/discounts");
      return;
    }

    handleGetData(discountId);
  }, [discountId]);

  return (
    <FormLayout
      title={t("title")}
      loading={!discount}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/discounts",
        },
        {
          title: t("breadcrumb.update"),
        },
      ]}>
      <Fragment>
        {discount && (
          <DiscountForm
            form={discountForm}
            data={discount}
            handleChangeThumbnail={onChangeThumbnail}
          />
        )}

        <FormFooter
          onCancel={() => router.push("/discounts")}
          okProps={{
            loading,
            disabled: loading,
          }}
          onOk={discountForm.handleSubmit((values) =>
            handleOnSubmit(discountId, values),
          )}
        />
        {/* Message of antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default EditDiscountPage;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

EditDiscountPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import { useRouter } from "next/router";
import { useState, ReactElement, Fragment, useMemo, useEffect } from "react";

import FormLayout from "~/layouts/FormLayout";

import {
  IAttribute,
  IAttributeChild,
  IFormAttibute,
  IResponse,
  IUpdateAttibute,
} from "~/interface";
import { getAttribute, updateAttribute } from "~/api-client";
import LayoutWithHeader from "~/layouts/Private";
import { NextPageWithLayout } from "~/interface/page";
import { useTranslations } from "next-intl";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AttributeForm } from "~/components/AttributePage";
import FormFooter from "~/components/Footer/FormFooter";
import { message } from "antd";

const initData: IFormAttibute = {
  code: "",
  name: "",
  public: true,
  children: [],
};

const Layout = LayoutWithHeader;

const CreateAttributePage: NextPageWithLayout = () => {
  const router = useRouter();
  const attributeId = router.query.id as string;

  const t = useTranslations("AttributePage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      name: string().trim().required(tError("PLEASE_INPUT")),
      code: string().trim().required(tError("PLEASE_INPUT")),
    });
  }, [router.locale]);

  // form control
  const attributeForm = useForm<IFormAttibute>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [attribute, setAttribute] = useState<IAttribute | null>(null);

  const [loading, setLoading] = useState<{
    getData: boolean;
    isSubmit: boolean;
  }>({ getData: true, isSubmit: false });

  const [messageApi, contextHolder] = message.useMessage();

  const handeGetAttribute = async (itemId: string) => {
    setLoading({ ...loading, getData: true });

    getAttribute(itemId)
      .then(({ payload }: IResponse<IAttribute>) => {
        const listChild = payload.children.map(
          (item: IAttributeChild) => item.name,
        );

        attributeForm.reset({
          name: payload.name,
          children: listChild,
          code: payload.code,
          public: payload.public,
        });
        setAttribute(payload);
        setLoading({ ...loading, getData: false });
      })
      .catch(() => {
        router.push("/attributes");
      });
  };

  const handleOnSubmit = async (attributeId: string, values: IFormAttibute) => {
    if (!attributeId) return;

    setLoading({ ...loading, isSubmit: true });

    const dataSend: IUpdateAttibute = {
      code: values.code,
      name: values.name,
      public: values.public,
    };

    await updateAttribute(attributeId, dataSend)
      .then(() => {
        messageApi.success(tSuccess("update"));
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
      });

    setLoading({ ...loading, isSubmit: false });
  };

  useEffect(() => {
    if (!attributeId) {
      router.push("/attributes");
      return;
    }

    handeGetAttribute(attributeId);
  }, [attributeId]);

  return (
    <FormLayout
      title={t("edit")}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/attributes",
        },
        {
          title: t("breadcrumb.edit"),
        },
      ]}>
      <Fragment>
        <AttributeForm form={attributeForm} data={attribute} />

        <FormFooter
          onCancel={() => router.push("/attributes")}
          onOk={attributeForm.handleSubmit((values) =>
            handleOnSubmit(attributeId, values),
          )}
          okProps={{
            loading: loading.isSubmit,
            disabled: loading.isSubmit,
          }}
        />
        {/* Message of Antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default CreateAttributePage;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CreateAttributePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

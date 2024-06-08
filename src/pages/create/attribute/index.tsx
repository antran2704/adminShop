import { useRouter } from "next/router";
import { useState, useCallback, ReactElement } from "react";
import { toast } from "react-toastify";

import ButtonCheck from "~/components/Button/ButtonCheck";
import { InputText } from "~/components/InputField";
import FormLayout from "~/layouts/FormLayout";

import { IAttribute, ISelectItem } from "~/interface";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import MultipleValue from "~/components/InputField/MultipleValue";
import Loading from "~/components/Loading";
import { createdAttribute } from "~/api-client";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { NextPageWithLayout } from "~/interface/page";
import { useTranslation } from "react-i18next";

const initData: IAttribute = {
  _id: "",
  code: "",
  name: "",
  public: true,
  variants: [],
};

const Layout = LayoutWithHeader;

const CreateAttributePage: NextPageWithLayout = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const [data, setData] = useState<IAttribute>(initData);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const changePublic = useCallback(
    (name: string, value: boolean) => {
      setData({ ...data, [name]: value });
    },
    [data]
  );

  const changeVariants = useCallback(
    (name: string, values: ISelectItem[]) => {
      if (fieldsCheck.includes(name)) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
        setFieldsCheck(newFieldsCheck);
      }
      setData({ ...data, variants: values });
    },
    [data, fieldsCheck]
  );

  const changeValue = useCallback(
    (name: string, value: string) => {
      if (fieldsCheck.includes(name)) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
        setFieldsCheck(newFieldsCheck);
      }
      setData({ ...data, [name]: value });
    },
    [data, fieldsCheck]
  );

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);
    if (fields.length > 0) {
      router.push(`#${fields[0]}`);
    }
    return fields;
  };

  const generateAttributes = (attributes: ISelectItem[]) => {
    return attributes.map((attribute) => ({
      name: attribute.title,
      public: true,
    }));
  };

  const handleOnSubmit = async () => {
    const fields = checkData([
      {
        name: "name",
        value: data.name,
      },
      {
        name: "code",
        value: data.code,
      },
      {
        name: "variants",
        value: data.variants,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    setLoading(true);

    try {
      const payload = await createdAttribute({
        name: data.name,
        code: data.code,
        variants: generateAttributes(data.variants as ISelectItem[]),
        public: data.public,
      });

      if (payload.status === 201) {
        toast.success("Success create attribute", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/attributes");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error in create attribute", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  return (
    <FormLayout
      title={t("CreateAttributePage.title")}
      backLink="/attributes"
      loading={loading}
      onSubmit={handleOnSubmit}
    >
      <div className="lg:w-2/4 w-full mx-auto">
        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <InputText
            title={t("CreateAttributePage.field.title")}
            width="w-full"
            value={data.name}
            error={fieldsCheck.includes("name")}
            name="name"
            placeholder="Color or Size or Material"
            getValue={changeValue}
          />

          <InputText
            title={t("CreateAttributePage.field.code")}
            width="w-full"
            value={data.code}
            name="code"
            error={fieldsCheck.includes("code")}
            getValue={changeValue}
          />

          <MultipleValue
            title={t("CreateAttributePage.variants.title")}
            width="w-full"
            items={data.variants as ISelectItem[]}
            name="variants"
            placeholder={t("CreateAttributePage.variants.placeholder")}
            error={fieldsCheck.includes("variants")}
            getAttributes={changeVariants}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <ButtonCheck
            title={t("CreateAttributePage.field.public")}
            name="public"
            width="w-fit"
            isChecked={data.public}
            onChange={changePublic}
          />
        </div>
      </div>
    </FormLayout>
  );
};

export default CreateAttributePage;

CreateAttributePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

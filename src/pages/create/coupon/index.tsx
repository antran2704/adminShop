import { useRouter } from "next/router";
import { useState, useCallback, ReactElement } from "react";
import { toast } from "react-toastify";

import ButtonCheck from "~/components/Button/ButtonCheck";
import { InputText, InputNumber } from "~/components/InputField";
import {
  ECompressFormat,
  EDicount_type,
  EDiscount_applies,
  ETypeImage,
} from "~/enums";
import FormLayout from "~/layouts/FormLayout";

import { ICouponCreate } from "~/interface";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import { axiosPost } from "~/ultils/configAxios";
import Thumbnail from "~/components/Image/Thumbnail";
import { uploadImageOnServer } from "~/helper/handleImage";
import { SelectDate, SelectTag } from "~/components/Select";
import { formatBigNumber } from "~/helper/number/fomatterCurrency";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { NextPageWithLayout } from "~/interface/page";
import { useTranslation } from "react-i18next";

const initData: ICouponCreate = {
  discount_code: "",
  discount_name: "",
  discount_value: 0,
  discount_applies: EDiscount_applies.ALL,
  discount_type: EDicount_type.PERCENTAGE,
  discount_product_ids: [],
  discount_start_date: "",
  discount_end_date: "",
  discount_per_user: 0,
  discount_min_value: 0,
  discount_max_uses: 0,
  discount_thumbnail: null,
  discount_active: true,
  discount_public: true,
};

const Layout = LayoutWithHeader;

const CreateCouponPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const [data, setData] = useState<ICouponCreate>(initData);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);

  const [discountType, setDiscountType] = useState<EDicount_type>(
    EDicount_type.PERCENTAGE
  );

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

  const changePublic = useCallback(
    (name: string, value: boolean) => {
      setData({ ...data, [name]: value });
    },
    [data]
  );

  const changeNumber = useCallback(
    (name: string, value: number) => {
      if (fieldsCheck.includes(name)) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
        setFieldsCheck(newFieldsCheck);
      }
      setData({ ...data, [name]: value });
    },
    [data]
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

  const onSelectDate = (value: string, name: string) => {
    if (name === "discount_start_date" && new Date(value) < new Date()) {
      toast.info("Start date must be greater than the current time!!!", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    if (
      name === "discount_end_date" &&
      (new Date(value) < new Date() ||
        new Date(data.discount_start_date) >= new Date(value))
    ) {
      toast.info("End date must be greater than the Start date!!!", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    if (fieldsCheck.includes(name)) {
      const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
      setFieldsCheck(newFieldsCheck);
    }

    setData({ ...data, [name]: value });
  };

  const onChangeDiscountValue = (
    type: EDicount_type,
    name: string,
    value: number
  ) => {
    if (fieldsCheck.includes(name)) {
      const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
      setFieldsCheck(newFieldsCheck);
    }

    if (type === EDicount_type.PERCENTAGE) {
      if (value > 100) {
        toast.info("Discount value must less than 100%", {
          position: toast.POSITION.TOP_RIGHT,
        });

        return;
      }
    }

    setData({ ...data, [name]: value });
  };

  const onSelectDiscountType = (value: string) => {
    setDiscountType(value as EDicount_type);
    setData({ ...data, discount_value: 0 });
  };

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);
    if (fields.length > 0) {
      router.push(`#${fields[0]}`);
    }
    return fields;
  };

  const uploadThumbnail = async (source: File) => {
    if (source) {
      if (fieldsCheck.includes("thumbnail")) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, "thumbnail");
        setFieldsCheck(newFieldsCheck);
        ("thumbnail");
      }

      const formData: FormData = new FormData();
      formData.append("thumbnail", source);
      setLoadingThumbnail(true);

      try {
        const { status, payload } = await uploadImageOnServer(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/discounts/uploadThumbnail`,
          formData
        );

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
    const fields = checkData([
      {
        name: "discount_name",
        value: data.discount_name,
      },
      {
        name: "discount_code",
        value: data.discount_code,
      },
      {
        name: "discount_value",
        value: data.discount_value,
      },
      {
        name: "discount_max_uses",
        value: data.discount_max_uses,
      },
      {
        name: "discount_per_user",
        value: data.discount_per_user,
      },
      {
        name: "discount_start_date",
        value: data.discount_start_date,
      },
      {
        name: "discount_end_date",
        value: data.discount_end_date,
      },
      {
        name: "thumbnail",
        value: thumbnail,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    try {
      const payload = await axiosPost("/discounts", {
        ...data,
        discount_code: data.discount_code.toUpperCase(),
        discount_thumbnail: thumbnail,
        discount_type: discountType,
      });

      if (payload.status === 201) {
        toast.success("Success create coupon", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/coupons");
      }
    } catch (error) {
      toast.error("Error in create coupon", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  return (
    <FormLayout
      title={t("CreateCouponPage.title")}
      backLink="/coupons"
      onSubmit={handleOnSubmit}
    >
      <div className="lg:w-2/4 w-full mx-auto">
        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <InputText
            title={t("CreateCouponPage.field.title")}
            width="w-full"
            value={data.discount_name}
            error={fieldsCheck.includes("discount_name")}
            name="discount_name"
            placeholder="Coupon name"
            getValue={changeValue}
          />

          <InputText
            title={t("CreateCouponPage.field.code")}
            width="w-full"
            value={data.discount_code.toUpperCase()}
            name="discount_code"
            error={fieldsCheck.includes("discount_code")}
            placeholder="Coupon Code"
            getValue={changeValue}
          />
        </div>

        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <SelectDate
            title={t("CreateCouponPage.field.startDate")}
            className="w-full"
            name="discount_start_date"
            type="datetime-local"
            value={data.discount_start_date}
            error={fieldsCheck.includes("discount_start_date")}
            onSelect={onSelectDate}
          />
          <SelectDate
            title={t("CreateCouponPage.field.endDate")}
            type="datetime-local"
            className={`w-full ${
              data.discount_start_date.length > 0
                ? "pointer-events-auto"
                : "opacity-60 pointer-events-none"
            }`}
            name="discount_end_date"
            value={data.discount_end_date}
            error={fieldsCheck.includes("discount_end_date")}
            onSelect={onSelectDate}
          />
        </div>

        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <div>
            <p className="text-base text-[#1E1E1E] dark:text-darkText font-medium mb-2">
              {t("CreateCouponPage.type.title")}
            </p>
            <div className="flex items-center gap-2">
              <SelectTag
                title={t("CreateCouponPage.type.percentage")}
                size="M"
                onSelect={onSelectDiscountType}
                value={EDicount_type.PERCENTAGE}
                currentSelect={discountType}
              />

              <SelectTag
                title={t("CreateCouponPage.type.fixedAmount")}
                size="M"
                onSelect={onSelectDiscountType}
                value={EDicount_type.FIXED_AMOUNT}
                currentSelect={discountType}
              />
            </div>
          </div>

          <div>
            <p className="text-base text-[#1E1E1E] dark:text-darkText font-medium mb-2">
              {t("CreateCouponPage.field.value")}
            </p>
            <div className="flex items-center gap-2">
              <p className="min-w-[40px] text-base text-[#1E1E1E] dark:text-darkText text-center font-medium">
                {discountType === EDicount_type.PERCENTAGE ? "%" : "VND"}
              </p>
              <InputNumber
                width="w-full"
                value={formatBigNumber(data.discount_value)}
                error={fieldsCheck.includes("discount_value")}
                name="discount_value"
                placeholder="Coupon value"
                getValue={(name: string, value: number) =>
                  onChangeDiscountValue(discountType, name, value)
                }
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <InputNumber
            title={t("CreateCouponPage.field.minimumValue")}
            width="w-full"
            value={formatBigNumber(data.discount_min_value)}
            name="discount_min_value"
            error={fieldsCheck.includes("discount_min_value")}
            placeholder="Minimum Amount"
            getValue={changeNumber}
          />

          <InputNumber
            title={t("CreateCouponPage.field.quantity")}
            width="w-full"
            value={data.discount_max_uses.toString()}
            name="discount_max_uses"
            error={fieldsCheck.includes("discount_max_uses")}
            placeholder="Coupon quantity"
            getValue={changeNumber}
          />

          <InputNumber
            title={t("CreateCouponPage.field.perUser")}
            width="w-full"
            value={data.discount_per_user.toString()}
            name="discount_per_user"
            error={fieldsCheck.includes("discount_per_user")}
            placeholder="Coupon per user"
            getValue={changeNumber}
          />
        </div>

        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <Thumbnail
            error={fieldsCheck.includes("thumbnail")}
            url={thumbnail}
            loading={loadingThumbnail}
            onChange={uploadThumbnail}
            option={{
              quality: 90,
              maxHeight: 100,
              maxWidth: 100,
              minHeight: 100,
              minWidth: 100,
              compressFormat: ECompressFormat.WEBP,
              type: ETypeImage.file,
            }}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <ButtonCheck
            title={t("CreateCouponPage.field.public")}
            name="discount_public"
            width="w-fit"
            isChecked={data.discount_public}
            onChange={changePublic}
          />
        </div>
      </div>
    </FormLayout>
  );
};

export default CreateCouponPage;

CreateCouponPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

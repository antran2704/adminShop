import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { message, TabsProps } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";

import { ECompressFormat, ETypeImage } from "~/enums";

import { UploadImage } from "../Core/Upload";
import { BtnDelete, BtnSwitch } from "../Button";
import { ModalConfirm } from "../Modal";
import { InputNumber, InputText } from "~/components/Core/Input";
import DateFilter from "~/components/Core/Filter/Date";
import TabsCore from "~/components/Core/Tabs";

import { ICreateDiscount, IDiscount } from "~/interface/discount";
import { formatBigNumber } from "~/helper/format/number";
import { deleteDiscount } from "~/api-client/discounts";
import { ENUM_DISCOUNT_TYPE } from "~/enums/discount";

interface Props {
  data?: IDiscount | null;
  form: UseFormReturn<ICreateDiscount, any, undefined>;
  handleChangeThumbnail: (file: File | null) => void;
}

const FormBanner = (props: Props) => {
  const t = useTranslations("DiscountPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const { form, data, handleChangeThumbnail } = props;

  const {
    control,
    formState: { errors },
    clearErrors,
    getValues,
    setValue,
  } = form;

  const [selectType, setSelectType] = useState<ENUM_DISCOUNT_TYPE>(
    ENUM_DISCOUNT_TYPE.PERCENTAGE,
  );

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  // Data of tabs type
  const tabsType: TabsProps["items"] = useMemo((): TabsProps["items"] => {
    return [
      {
        key: ENUM_DISCOUNT_TYPE.FIXED_AMOUNT,
        label: t("type.fixed"),
      },
      {
        key: ENUM_DISCOUNT_TYPE.PERCENTAGE,
        label: t("type.percentage"),
      },
    ];
  }, [router.locale]);

  // Can not select days after
  const disabledAfterDate: RangePickerProps["disabledDate"] = useCallback(
    (current: Dayjs) => {
      return (
        current &&
        current >= dayjs(getValues("discount_end_date")).startOf("day")
      );
    },
    [getValues("discount_end_date")],
  );

  // Can not select days before
  const disabledBeforeDate: RangePickerProps["disabledDate"] = useCallback(
    (current: Dayjs) => {
      return (
        current &&
        current <= dayjs(getValues("discount_start_date")).startOf("day")
      );
    },
    [getValues("discount_start_date")],
  );

  const onChangeTab = (key: ENUM_DISCOUNT_TYPE) => {
    const value: number = getValues("discount_value");
    if (key === ENUM_DISCOUNT_TYPE.PERCENTAGE && value > 100) {
      setValue("discount_value", 100);
    }

    setSelectType(key);
  };

  const onDeleteModal = () => {
    setModalDelete(!modalDelete);
  };

  const onChangeImage = (file: File | null) => {
    if (!file) {
      setValue("discount_thumbnail", "");
    } else {
      setValue("discount_thumbnail", file.lastModified.toString());
      clearErrors("discount_thumbnail");
    }

    handleChangeThumbnail(file);
  };

  const onDeleteBanner = async (id: string) => {
    if (!id) return;
    setDeleteLoading(true);

    await deleteDiscount(id)
      .then(() => {
        messageApi.success(tSuccess("delete"));
        router.push("/discounts");
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
        setDeleteLoading(false);
      });
  };

  useEffect(() => {
    if (data) {
      setSelectType(data.discount_type);
    }
  }, [data]);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* name */}
      <div className={clsx([errors.discount_name && "pb-2"])}>
        <Controller
          name="discount_name"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.name")}
              error={!!errors.discount_name}
              placeholder={tError("PLEASE_INPUT")}
              {...field}
            />
          )}
        />
        {errors.discount_name?.message && (
          <p className="absolute text-sm text-error">
            {errors.discount_name.message}
          </p>
        )}
      </div>

      {/* code */}
      <div className={clsx([errors.discount_code && "pb-2"])}>
        <Controller
          name="discount_code"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <InputText
              title={t("form.code")}
              error={!!errors.discount_code}
              placeholder={tError("PLEASE_INPUT")}
              value={value.toUpperCase()}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
              {...rest}
            />
          )}
        />
        {errors.discount_code?.message && (
          <p className="absolute text-sm text-error">
            {errors.discount_code.message}
          </p>
        )}
      </div>

      {/* Start date */}
      <div className={clsx([errors.discount_start_date && "pb-2"])}>
        <Controller
          name="discount_start_date"
          control={control}
          render={({ field: { value, onChange } }) => (
            <DateFilter
              title={t("form.startDate")}
              placeholder={tError("PLEASE_SELECT")}
              value={value ? dayjs(value) : null}
              onChangeDate={(_, option) => onChange(option.toISOString())}
              disabledDate={(date, info) => {
                if (getValues("discount_end_date")) {
                  return disabledAfterDate(date, info);
                }
                return false;
              }}
            />
          )}
        />
        {errors.discount_start_date?.message && (
          <p className="absolute text-sm text-error">
            {errors.discount_start_date.message}
          </p>
        )}
      </div>

      {/* End Date */}
      <div className={clsx([errors.discount_end_date && "pb-2"])}>
        <Controller
          name="discount_end_date"
          control={control}
          render={({ field: { value, onChange } }) => (
            <DateFilter
              title={t("form.endDate")}
              placeholder={tError("PLEASE_SELECT")}
              value={value ? dayjs(value) : null}
              onChangeDate={(_, option) => onChange(option.toISOString())}
              disabledDate={(date, info) => {
                if (getValues("discount_start_date")) {
                  return disabledBeforeDate(date, info);
                }
                return false;
              }}
            />
          )}
        />
        {errors.discount_end_date?.message && (
          <p className="absolute text-sm text-error">
            {errors.discount_end_date.message}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      <Controller
        name="discount_thumbnail"
        control={control}
        render={({ field: { ref } }) => (
          <div className="md:w-1/2 w-full">
            <UploadImage
              title={t("form.thumbnail")}
              height={400}
              width={"100%"}
              src={
                getValues("discount_thumbnail")
                  ? (getValues("discount_thumbnail") as string)
                  : ""
              }
              error={!!errors.discount_thumbnail?.message}
              onChangeImage={onChangeImage}
              option={{
                quality: 80,
                maxHeight: 600,
                maxWidth: 1000,
                minHeight: 600,
                minWidth: 1000,
                compressFormat: ECompressFormat.JPEG,
                type: ETypeImage.file,
              }}
            />
            <input className="opacity-0 absolute" type="text" ref={ref} />
          </div>
        )}
      />

      {/* Value */}
      <div className={clsx([errors.discount_value && "pb-2"])}>
        <TabsCore
          size="large"
          activeKey={selectType}
          items={tabsType}
          onChange={(value) => onChangeTab(value as ENUM_DISCOUNT_TYPE)}
        />

        <p className={clsx("text-base pb-2 dark:text-darkInput")}>
          {t("form.value")}
        </p>

        <div className="relative">
          <Controller
            name="discount_value"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <InputNumber
                error={!!errors.discount_value}
                maximum={
                  selectType === ENUM_DISCOUNT_TYPE.PERCENTAGE ? 100 : 999999999
                }
                placeholder={tError("PLEASE_INPUT")}
                value={formatBigNumber(value) || 0}
                onChangeValue={onChange}
                {...rest}
              />
            )}
          />

          <span className="absolute block bottom-0 right-0 h-full text-sm border-l px-5 py-2 bg-neutral-100 rounded-tr-md rounded-br-md">
            {selectType === ENUM_DISCOUNT_TYPE.FIXED_AMOUNT
              ? t("type.fixed")
              : t("type.percentage")}
          </span>
        </div>

        {errors.discount_value?.message && (
          <p className="absolute text-sm text-error">
            {errors.discount_value.message}
          </p>
        )}
      </div>

      {/* Min value */}
      <div className={clsx([errors.discount_min_value && "pb-2"])}>
        <Controller
          name="discount_min_value"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <InputNumber
              title={t("form.minValue")}
              error={!!errors.discount_min_value}
              placeholder={tError("PLEASE_INPUT")}
              value={formatBigNumber(value) || 0}
              onChangeValue={onChange}
              {...rest}
            />
          )}
        />
        {errors.discount_min_value?.message && (
          <p className="absolute text-sm text-error">
            {errors.discount_min_value.message}
          </p>
        )}
      </div>

      {/* Max use */}
      <div className={clsx([errors.discount_max_uses && "pb-2"])}>
        <Controller
          name="discount_max_uses"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <InputNumber
              title={t("form.quantity")}
              error={!!errors.discount_max_uses}
              placeholder={tError("PLEASE_INPUT")}
              value={formatBigNumber(value) || 0}
              onChangeValue={onChange}
              {...rest}
            />
          )}
        />
        {errors.discount_max_uses?.message && (
          <p className="absolute text-sm text-error">
            {errors.discount_max_uses.message}
          </p>
        )}
      </div>

      {/* Per user */}
      <div className={clsx([errors.discount_per_user && "pb-2"])}>
        <Controller
          name="discount_per_user"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <InputNumber
              title={t("form.perUser")}
              error={!!errors.discount_per_user}
              placeholder={tError("PLEASE_INPUT")}
              value={formatBigNumber(value) || 0}
              onChangeValue={onChange}
              {...rest}
            />
          )}
        />
        {errors.discount_per_user?.message && (
          <p className="absolute text-sm text-error">
            {errors.discount_per_user.message}
          </p>
        )}
      </div>

      {/* status - public */}
      <div className="flex flex-col gap-5">
        <Controller
          name="discount_active"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div>
              <BtnSwitch
                title={t("form.status")}
                value={value}
                className="w-fit"
                onChange={onChange}
              />
            </div>
          )}
        />

        <Controller
          name="discount_public"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div>
              <BtnSwitch
                title={t("form.public")}
                value={value}
                className="w-fit"
                onChange={onChange}
              />
            </div>
          )}
        />
      </div>

      {/* Delete */}
      {data && (
        <div>
          <BtnDelete
            type="primary"
            title={tCommon("btn.delete")}
            size="large"
            onClick={onDeleteModal}
            className="w-fit">
            <p>{tCommon("btn.delete")}</p>
          </BtnDelete>
        </div>
      )}

      {/* Message of Antd */}
      {contextHolder}

      <ModalConfirm
        title={t("modalDelete.title")}
        open={modalDelete}
        onCancel={onDeleteModal}
        centered
        type="error"
        destroyOnClose
        okButtonProps={{
          loading: deleteLoading,
          disabled: deleteLoading,
        }}
        onOk={() => onDeleteBanner(data?._id as string)}>
        <img
          src="/popup/trash.svg"
          className="size-[200px] mx-auto"
          title="delete image"
          alt="delete image"
        />
        <p className="md:text-lg text-base text-center mb-10">
          {t("modalDelete.description")}
        </p>
      </ModalConfirm>
    </div>
  );
};

export default FormBanner;

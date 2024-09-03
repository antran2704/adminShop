import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { message } from "antd";
import clsx from "clsx";

import { IBanner, ICreateBanner } from "~/interface";
import { ECompressFormat, ETypeImage } from "~/enums";

import { UploadImage } from "../Core/Upload";
import { BtnDelete, BtnSwitch } from "../Button";
import { InputText } from "~/components/Core/Input";
import { ModalConfirm } from "../Modal";

import { deleteBanner } from "~/api-client";

interface Props {
  banner?: IBanner | null;
  form: UseFormReturn<ICreateBanner, any, undefined>;
  handleChangeThumbnail: (file: File | null) => void;
}

const FormBanner = (props: Props) => {
  const t = useTranslations("BannerPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const { form, banner, handleChangeThumbnail } = props;

  const {
    control,
    formState: { errors },
    clearErrors,
    getValues,
    setValue,
  } = form;

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onDeleteModal = () => {
    setModalDelete(!modalDelete);
  };

  const onChangeImage = (file: File | null) => {
    if (!file) {
      setValue("image", "");
    } else {
      setValue("image", file.lastModified.toString());
      clearErrors("image");
    }

    handleChangeThumbnail(file);
  };

  const onDeleteBanner = async (bannerId: string) => {
    if (!bannerId) return;
    setDeleteLoading(true);

    await deleteBanner(bannerId)
      .then(() => {
        messageApi.success(tSuccess("delete"));
        router.push("/banners");
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
        setDeleteLoading(false);
      });
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* title */}
      <div className={clsx("relative w-full", [errors.title && "pb-2"])}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.title")}
              width="w-full"
              error={!!errors.title}
              placeholder={t("placeholder.title")}
              {...field}
            />
          )}
        />
        {errors.title?.message && (
          <p className="absolute text-sm text-error">{errors.title.message}</p>
        )}
      </div>

      {/* meta title */}
      <div className={clsx("relative w-full", [errors.title && "pb-2"])}>
        <Controller
          name="meta_title"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.metaTitle")}
              width="w-full"
              error={!!errors.meta_title}
              placeholder={t("placeholder.metaTitle")}
              {...field}
            />
          )}
        />
        {errors.meta_title?.message && (
          <p className="absolute text-sm text-error">
            {errors.meta_title.message}
          </p>
        )}
      </div>

      {/* thumbnail */}
      <Controller
        name="image"
        control={control}
        render={({ field: { ref } }) => (
          <div className="md:w-1/2 w-full">
            <UploadImage
              title={t("form.thumbnail")}
              height={400}
              width={"100%"}
              src={getValues("image") ? getValues("image") : ""}
              error={!!errors.image?.message}
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

      {/* status */}
      <Controller
        name="public"
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

      {/* Delete */}
      {banner && (
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
        onOk={() => onDeleteBanner(banner?._id as string)}>
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

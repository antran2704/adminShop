import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { message } from "antd";
import clsx from "clsx";

import { IAttribute, IFormAttibute } from "~/interface";

import { BtnDelete, BtnSwitch } from "../Button";
import { InputText } from "~/components/Core/Input";
import { ModalConfirm } from "../Modal";

import { deleteAttribute } from "~/api-client";
import ListTags from "../Core/ListTags";

interface Props {
  data?: IAttribute | null;
  form: UseFormReturn<IFormAttibute, any, undefined>;
}

const AttributeForm = (props: Props) => {
  const t = useTranslations("AttributePage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const { form, data } = props;

  const {
    control,
    formState: { errors },
  } = form;

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onDeleteModal = () => {
    setModalDelete(!modalDelete);
  };

  const onDelete = async (itemId: string) => {
    if (!itemId) return;
    setDeleteLoading(true);

    await deleteAttribute(itemId)
      .then(() => {
        messageApi.success(tSuccess("delete"));
        router.push("/attributes");
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
        setDeleteLoading(false);
      });
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Name */}
      <div className={clsx("relative w-full", [errors.name && "pb-2"])}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.title")}
              width="w-full"
              error={!!errors.name}
              placeholder={tError("PLEASE_INPUT")}
              {...field}
            />
          )}
        />
        {errors.name?.message && (
          <p className="absolute text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      {/* Code */}
      <div className={clsx("relative w-full", [errors.code && "pb-2"])}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.code")}
              width="w-full"
              error={!!errors.code}
              placeholder={tError("PLEASE_INPUT")}
              {...field}
            />
          )}
        />
        {errors.code?.message && (
          <p className="absolute text-sm text-error">{errors.code.message}</p>
        )}
      </div>

      {/* list attribute */}
      <div className={clsx("relative w-full", [errors.children && "pb-2"])}>
        <Controller
          name="children"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ListTags
              disabled={!!data}
              title={t("form.children")}
              error={!!errors.code?.message}
              data={value}
              onChange={onChange}
            />
          )}
        />
        {errors.code?.message && (
          <p className="absolute text-sm text-error">{errors.code.message}</p>
        )}
      </div>

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
        onOk={() => onDelete(data?._id as string)}>
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

export default AttributeForm;

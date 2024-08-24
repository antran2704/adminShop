import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { message } from "antd";
import clsx from "clsx";

import { ECompressFormat, ETypeImage } from "~/enums";

import { UploadImage } from "../Core/Upload";
import { BtnDelete, BtnSwitch } from "../Button";
import { InputText } from "~/components/Core/Input";
import { ModalConfirm } from "../Modal";

import { IBlogTag, ICreateBlogTag } from "~/interface/blog/blogTag";
import { deleteTagBlog } from "~/api-client/blogs/tagBlog";
import { ETypeFile } from "~/enums/file";

interface Props {
  data?: IBlogTag | null;
  form: UseFormReturn<ICreateBlogTag, any, undefined>;
  handleChangeThumbnail: (file: File | null) => void;
}

const FormBlogTag = (props: Props) => {
  const t = useTranslations("BlogTagPage");
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

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onDeleteModal = () => {
    setModalDelete(!modalDelete);
  };

  const onChangeImage = (file: File | null) => {
    if (!file) {
      setValue("thumbnail", "");
    } else {
      setValue("thumbnail", file.lastModified.toString());
      clearErrors("thumbnail");
    }

    handleChangeThumbnail(file);
  };

  const onDelete = async (id: string) => {
    if (!id) return;
    setDeleteLoading(true);

    await deleteTagBlog(id)
      .then(() => {
        messageApi.success(tSuccess("delete"));
        router.push("/blog-tag");
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
              placeholder={tError("PLEASE_INPUT")}
              {...field}
            />
          )}
        />
        {errors.title?.message && (
          <p className="absolute text-sm text-error">{errors.title.message}</p>
        )}
      </div>

      {/* thumbnail */}
      <div>
        <Controller
          name="thumbnail"
          control={control}
          render={({ field: { ref } }) => (
            <div className="w-[200px]">
              <UploadImage
                title={t("form.thumbnail")}
                height={200}
                width={"100%"}
                src={
                  getValues("thumbnail")
                    ? process.env.NEXT_PUBLIC_IMAGE_ENDPOINT +
                      getValues("thumbnail")
                    : ""
                }
                error={!!errors.thumbnail?.message}
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
                rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
              />
              <input className="opacity-0 absolute" type="text" ref={ref} />
            </div>
          )}
        />

        {errors.thumbnail?.message && (
          <p className="absolute text-sm text-error">
            {errors.thumbnail.message}
          </p>
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

export default FormBlogTag;

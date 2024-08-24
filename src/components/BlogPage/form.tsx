import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Controller, UseFormReturn } from "react-hook-form";
import { message, SelectProps } from "antd";
import clsx from "clsx";

import {
  ECompressFormat,
  ETypeImage,
  ORDER_PARAMATER_ENUM,
  STATUS_PARAMATER_ENUM,
} from "~/enums";

import { UploadImage } from "../Core/Upload";
import { BtnDelete, BtnSwitch } from "../Button";
import { InputText, InputTextArea } from "~/components/Core/Input";
import { ModalConfirm } from "../Modal";
const Editor = dynamic(
  () => {
    return import("~/components/Editor");
  },
  { ssr: false },
);

import { ETypeFile } from "~/enums/file";
import { IBlog, ICreateBlog } from "~/interface/blog";
import { deleteBlog } from "~/api-client/blogs";
import dynamic from "next/dynamic";
import { SelectFilterCore } from "../Core";
import { IPagination, IResponseWithPagination } from "~/interface";
import { IBlogTag } from "~/interface/blog/blogTag";
import { getTagBlogs } from "~/api-client/blogs/tagBlog";
import { DefaultOptionType } from "antd/es/select";

interface Props {
  data?: IBlog | null;
  form: UseFormReturn<ICreateBlog, any, undefined>;
  handleChangeThumbnail: (file: File | null) => void;
}

const FormBlog = (props: Props) => {
  const t = useTranslations("BlogPage");
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

  const [tags, setTags] = useState<IBlogTag[]>([]);
  const [paginationTag, setPaginationTag] = useState<IPagination>({
    page: 1,
    take: 60,
    total: 0,
  });

  const [selectTags, setSelectTags] = useState<SelectProps["options"]>([]);

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onSelectTags = (option: DefaultOptionType[]) => {
    setSelectTags(option);
  };

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

    await deleteBlog(id)
      .then(() => {
        messageApi.success(tSuccess("delete"));
        router.push("/blogs");
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
        setDeleteLoading(false);
      });
  };

  // hanlde get Tags
  const handleGetTags = async () => {
    if (paginationTag.total && paginationTag.total <= tags.length) return;

    await getTagBlogs({
      order: ORDER_PARAMATER_ENUM.DESC,
      page: paginationTag.page,
      take: paginationTag.take,
      status: STATUS_PARAMATER_ENUM.ACTIVE,
    }).then((res: IResponseWithPagination<IBlogTag[]>) => {
      setTags([...tags, ...res.payload]);
      setPaginationTag({
        ...paginationTag,
        total: res.pagination.total,
        page: paginationTag.page + 1,
      });
    });
  };

  useEffect(() => {
    if (data && !!data.tags.length) {
      const optionsTag: SelectProps["options"] = data.tags.map((item) => ({
        label: item.title,
        value: item._id,
      }));
      setSelectTags(optionsTag);
    }
  }, [data]);

  useEffect(() => {
    handleGetTags();
  }, []);

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

      {/* description */}
      <div className={clsx("relative w-full", [errors.description && "pb-2"])}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputTextArea
              title={t("form.description")}
              error={!!errors.description}
              placeholder={tError("PLEASE_INPUT")}
              {...field}
            />
          )}
        />
        {errors.description?.message && (
          <p className="absolute text-sm text-error">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* meta title */}
      <div className={clsx("relative w-full", [errors.meta_title && "pb-2"])}>
        <Controller
          name="meta_title"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.metaTitle")}
              error={!!errors.meta_title}
              placeholder={tError("PLEASE_INPUT")}
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

      {/* meta description */}
      <div
        className={clsx("relative w-full", [
          errors.meta_description && "pb-2",
        ])}>
        <Controller
          name="meta_description"
          control={control}
          render={({ field }) => (
            <InputTextArea
              title={t("form.metaDescription")}
              error={!!errors.meta_description}
              placeholder={tError("PLEASE_INPUT")}
              {...field}
            />
          )}
        />
        {errors.meta_description?.message && (
          <p className="absolute text-sm text-error">
            {errors.meta_description.message}
          </p>
        )}
      </div>

      {/* thumbnail */}
      <div className={clsx("relative w-full", [errors.thumbnail && "pb-2"])}>
        <Controller
          name="thumbnail"
          control={control}
          render={({ field: { ref } }) => (
            <div className="w-[300px]">
              <UploadImage
                title={t("form.thumbnail")}
                height={300}
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

      {/* content */}
      <div className={clsx("relative w-full", [errors.content && "pb-2"])}>
        <Controller
          name="content"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Editor
              title={t("form.content")}
              content={value}
              error={!!errors.content}
              getContent={onChange}
            />
          )}
        />
        {errors.content?.message && (
          <p className="absolute text-sm text-error">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* list tag */}
      <div className={clsx("relative w-full", [errors.tags && "pb-2"])}>
        <Controller
          name="tags"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectFilterCore
              showSearch
              title={t("form.tags")}
              mode="multiple"
              placeholder={tError("PLEASE_SELECT")}
              filterOption={(input, option) =>
                ((option?.label as string) ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              status={!!errors.tags?.message ? "error" : ""}
              options={tags.map((tag) => ({
                label: tag.title,
                value: tag._id,
              }))}
              value={value || null}
              allowClear
              scrollVitual={true}
              onScrollVitual={handleGetTags}
              {...rest}
              onChange={(value, option) => {
                onChange(value);
                onSelectTags(option as DefaultOptionType[]);
              }}
            />
          )}
        />
        {errors.tags?.message && (
          <p className="absolute text-sm text-error">{errors.tags.message}</p>
        )}
      </div>

      {/* tag */}
      <div className={clsx("relative w-full", [errors.tags && "pb-2"])}>
        <Controller
          name="tag"
          control={control}
          render={({ field: { value, ...rest } }) => (
            <SelectFilterCore
              showSearch
              title={t("form.tag")}
              disabled={!getValues("tags").length}
              placeholder={tError("PLEASE_SELECT")}
              filterOption={(input, option) =>
                ((option?.label as string) ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              status={!!errors.tag?.message ? "error" : ""}
              options={selectTags}
              value={value || null}
              allowClear
              {...rest}
            />
          )}
        />
        {errors.tag?.message && (
          <p className="absolute text-sm text-error">{errors.tag.message}</p>
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

export default FormBlog;

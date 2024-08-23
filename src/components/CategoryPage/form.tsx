import clsx from "clsx";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  ICategory,
  ICreateCategory,
  IParentCategory,
  IResponse,
  IResponseWithPagination,
} from "~/interface";
import { InputText, InputTextArea } from "~/components/Core/Input";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useState } from "react";
import {
  deleteCategory,
  getChildInCategory,
  getParentCategories,
  getParentCategory,
} from "~/api-client";
import { message, Switch, TreeSelect, TreeSelectProps } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { UploadImage } from "../Core/Upload";
import { ECompressFormat, ETypeImage } from "~/enums";
import { BtnDelete } from "../Button";
import { ModalConfirm } from "../Modal";
import { useRouter } from "next/router";

interface Props {
  category?: ICategory | null;
  form: UseFormReturn<ICreateCategory, any, undefined>;
  onChangeThumbnail: (file: File | null) => void;
}

const CategoryForm = (props: Props) => {
  const { form, category, onChangeThumbnail } = props;

  const t = useTranslations("CategoryPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, "label">[]>([
    {
      id: 0,
      pId: null,
      value: "home",
      title: "Home",
    },
  ]);

  const [listDisable, setListDisable] = useState<string[]>([]);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<{
    delete: boolean;
  }>({
    delete: false,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const onSelectTree = (categoryId: string) => {
    if (errors.parent_id?.message) {
      clearErrors("parent_id");
    }

    setValue("parent_id", categoryId);
  };

  const onChangeImage = (file: File | null) => {
    if (!file) {
      setValue("thumbnail", "");
    } else {
      setValue("thumbnail", file.lastModified.toString());
      clearErrors("thumbnail");
    }

    onChangeThumbnail(file);
  };

  const onDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const onDelete = async (categoryId: string) => {
    if (!categoryId) return;
    setLoading({ ...loading, delete: true });

    try {
      await deleteCategory(categoryId);
      setDeleteModal(false);
      messageApi.success(tSuccess("delete"));

      router.push("/categories");
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
      setLoading({ ...loading, delete: false });
    }
  };

  const handleGetChildCategory = async (parentId: string) => {
    if (!parentId) return;

    await getChildInCategory(parentId)
      .then((res: IResponseWithPagination<IParentCategory[]>) => {
        const newDisableItems: string[] = [];
        const listTree: Omit<DefaultOptionType, "label">[] = res.payload.map(
          (item: IParentCategory) => {
            if (category?._id === item._id || listDisable.includes(parentId)) {
              newDisableItems.push(item._id);
            }

            return {
              id: item._id,
              pId: parentId,
              value: item._id,
              title: item.title,
              isLeaf: !item.children.length,
              disabled:
                category?._id === item._id || listDisable.includes(parentId),
            };
          },
        );

        setTreeData([...treeData, ...listTree]);
        setListDisable([...listDisable, ...newDisableItems]);
      })
      .catch((err) => err);
  };

  const handleGetFirstTime = async (
    categoryId: string,
    data: Omit<DefaultOptionType, "label">[],
  ) => {
    await getParentCategory(categoryId).then(
      (res: IResponse<IParentCategory>) => {
        const itemTree: Omit<DefaultOptionType, "label"> = {
          id: res.payload._id,
          pId: res.payload.parent_id,
          value: res.payload._id,
          title: res.payload.title,
          isLeaf: !res.payload.children.length,
          disabled: true,
        };

        data.push(itemTree);
        setTreeData([...treeData, ...data]);
      },
    );
  };

  // hanlde get child in a category
  const onLoadChildCategory: TreeSelectProps["loadData"] = async ({
    id: parentId,
  }) => {
    if (!parentId) return;

    handleGetChildCategory(parentId);
  };

  //   handle get parent categories
  const handleGetCategoriesParent = async () => {
    getParentCategories()
      .then((res: IResponse<IParentCategory[]>) => {
        const listTree: Omit<DefaultOptionType, "label">[] = res.payload.map(
          (item: IParentCategory) => ({
            id: item._id,
            pId: 0,
            value: item._id,
            title: item.title,
            isLeaf: !item.children.length,
            disabled:
              item._id === category?._id || item._id === category?.parent_id,
          }),
        );

        if (category?._id && category.parent_id) {
          handleGetFirstTime(category.parent_id as string, listTree);
        } else {
          setTreeData([...treeData, ...listTree]);
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    handleGetCategoriesParent();
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

      {/* description */}
      <div className={clsx("relative w-full", [errors.description && "pb-2"])}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputTextArea
              title={t("form.description")}
              className="w-full"
              error={!!errors.description}
              placeholder={t("placeholder.description")}
              rows={4}
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

      <Controller
        name="thumbnail"
        control={control}
        render={({ field: { ref, value } }) => (
          <Fragment>
            <UploadImage
              title={t("form.thumbnail")}
              height={200}
              width={200}
              className=""
              src={value ? process.env.NEXT_PUBLIC_IMAGE_ENDPOINT + value : ""}
              error={!!errors.thumbnail?.message}
              onChangeImage={onChangeImage}
              option={{
                quality: 90,
                maxHeight: 200,
                maxWidth: 200,
                minHeight: 200,
                minWidth: 200,
                compressFormat: ECompressFormat.WEBP,
                type: ETypeImage.file,
              }}
            />
            <input className="opacity-0 absolute" type="text" ref={ref} />
          </Fragment>
        )}
      />

      <div className={clsx("relative w-full", [errors.parent_id && "pb-2"])}>
        <p
          className={clsx("text-base pb-2", [
            errors.parent_id && "text-error",
          ])}>
          {t("form.parentCategory")}
        </p>

        {category && (
          <ul className="flex items-center text-sm dark:text-darkInput pb-5 gap-2">
            <li>{`Home >`}</li>
            {category.breadcrumbs.map((item) => (
              <li key={item._id}>{`${item.title} > `}</li>
            ))}
            <li>{category.title}</li>
          </ul>
        )}

        <Controller
          name="parent_id"
          control={control}
          render={({ field: { value } }) => (
            <TreeSelect
              treeLine
              treeDataSimpleMode
              style={{ width: "100%" }}
              value={value || undefined}
              size="large"
              status={!!errors.parent_id?.message ? "error" : ""}
              // treeDefaultExpandedKeys={["home", ...listParent]}
              treeDefaultExpandedKeys={["home"]}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder={t("placeholder.parent")}
              onChange={onSelectTree}
              loadData={onLoadChildCategory}
              treeData={treeData}
            />
          )}
        />
        {errors.parent_id?.message && (
          <p className="absolute text-sm text-error">
            {errors.parent_id.message}
          </p>
        )}
      </div>

      {/* status */}
      <div>
        <p className={clsx("text-base pb-2")}>{t("form.status")}</p>
        <Controller
          name="public"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch value={value} onChange={onChange} />
          )}
        />
      </div>

      {/* Delete */}
      {category && (
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

      {/* Modal delete */}
      <ModalConfirm
        title={t("modalDelete.title")}
        open={deleteModal}
        onCancel={onDeleteModal}
        centered
        type="error"
        destroyOnClose
        onOk={() => onDelete(category?._id as string)}
        okButtonProps={{ loading: loading.delete, disabled: loading.delete }}>
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

      {/* Message of Antd */}
      {contextHolder}
    </div>
  );
};

export default CategoryForm;

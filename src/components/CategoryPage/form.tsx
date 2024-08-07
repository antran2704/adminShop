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
  getChildInCategory,
  getParentCategories,
  getParentCategory,
} from "~/api-client";
import { message, Switch, TreeSelect, TreeSelectProps } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { UploadImage } from "../Core/Upload";
import { ECompressFormat, ETypeImage } from "~/enums";
import { BtnDelete } from "../Button";

interface Props {
  category?: ICategory | null;
  form: UseFormReturn<ICreateCategory, any, undefined>;
  onChangeThumbnail: (file: File | null) => void;
}

const CategoryForm = (props: Props) => {
  const { form, category, onChangeThumbnail } = props;

  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;

  const t = useTranslations("CategoryPage");

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, "label">[]>([
    {
      id: 0,
      pId: null,
      value: "home",
      title: "Home",
    },
  ]);

  const [listParent, setListParent] = useState<string[]>([]);
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

  const handleGetChildCategory = async (parentId: string) => {
    await getChildInCategory(parentId).then(
      (res: IResponseWithPagination<IParentCategory[]>) => {
        const listTree: Omit<DefaultOptionType, "label">[] = res.payload.map(
          (item: IParentCategory) => ({
            id: item._id,
            pId: parentId,
            value: item._id,
            title: item.title,
            isLeaf: !item.children.length,
            disabled: item._id === category?._id,
          }),
        );

        setTreeData([...treeData, ...listTree]);
      },
    );
  };

  const handleGetFirstTime = async (
    categoryId: string | null,
    data: Omit<DefaultOptionType, "label">[],
    listId: string[],
  ) => {
    if (!categoryId) {
      setListParent(listId);
      setTreeData([...treeData, ...data]);
      return;
    }

    await getParentCategory(categoryId).then(
      (res: IResponse<IParentCategory>) => {
        if (!res.payload.parent_id) {
          setTreeData([...treeData, ...data]);
          setListParent([...listId, res.payload._id]);
          return;
        }

        const itemTree: Omit<DefaultOptionType, "label"> = {
          id: res.payload._id,
          pId: res.payload.parent_id,
          value: res.payload._id,
          title: res.payload.title,
          isLeaf: !res.payload.children.length,
          disabled: true,
        };

        data.push(itemTree);
        handleGetFirstTime(res.payload.parent_id, data, [
          ...listId,
          res.payload._id,
        ]);
      },
    );
  };

  // hanlde get child in a category
  const onLoadChildCategory: TreeSelectProps["loadData"] = async ({
    id: parentId,
  }) => {
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
          handleGetFirstTime(category.parent_id as string, listTree, []);
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
    <div className="w-full flex flex-col  mx-auto p-5 mt-5 bg-white rounded-md border-2 gap-5">
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
      <div className={clsx("relative w-full", [errors.title && "pb-2"])}>
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
              treeDefaultExpandedKeys={["home", ...listParent]}
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

      {/* Message of Antd */}
      {contextHolder}
    </div>
  );
};

export default CategoryForm;

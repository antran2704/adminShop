import clsx from "clsx";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  ICategory,
  ICreateCategory,
  IParentCategory,
  IResponse,
  IResponseWithPagination,
} from "~/interface";
import { InputText } from "~/components/Core/Input";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  getChildInCategory,
  getParentCategories,
  getParentCategory,
} from "~/api-client";
import { TreeSelect, TreeSelectProps } from "antd";
import { DefaultOptionType } from "antd/es/select";

interface Props {
  data?: ICategory | null;
  form: UseFormReturn<ICreateCategory, any, undefined>;
  handleChangeThumbnail: (file: File | null) => void;
}

const CategoryForm = (props: Props) => {
  const { form } = props;

  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;

  const t = useTranslations("CategoryPage");
  const [selectCategory, setSelectCategory] = useState<string>();

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, "label">[]>(
    [],
  );

  const onSelectTree = (categoryId: string) => {
    if (errors.parent_id?.message) {
      clearErrors("parent_id");
    }

    setValue("parent_id", categoryId);
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
          }),
        );

        setTreeData([...treeData, ...listTree]);
      },
    );
  };

  const handleGetFirstTime = async (
    categoryId: string | null,
    data: Omit<DefaultOptionType, "label">[],
  ) => {
    console.log("data", data);
    if (!categoryId) {
      setTreeData(data);
      return;
    }

    await getParentCategory(categoryId).then(
      (res: IResponse<IParentCategory>) => {
        if (!res.payload.parent_id) {
          setTreeData(data);
          return;
        }

        const itemTree: Omit<DefaultOptionType, "label"> = {
          id: res.payload._id,
          pId: res.payload.parent_id,
          value: res.payload._id,
          title: res.payload.title,
          isLeaf: !res.payload.children.length,
          checkable: true,
        };

        data.push(itemTree);
        handleGetFirstTime(res.payload.parent_id, data);
        // setTreeData([...treeData, ...listTree]);
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
          }),
        );

        handleGetFirstTime("65faa734d86acf925df23842", listTree);
        // setTreeData(listTree);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    handleGetCategoriesParent();
  }, []);

  return (
    <div className="lg:w-2/4 w-full mx-auto">
      <div className="w-full flex flex-col p-5 mt-5 bg-white rounded-md border-2 gap-5">
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
            <p className="absolute text-sm text-error">
              {errors.title.message}
            </p>
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
      </div>

      <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
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
                value={value || "65faa734d86acf925df23842"}
                size="large"
                treeDefaultExpandedKeys={["65faa734d86acf925df23842"]}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="Please select"
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
      </div>

      {/* <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
        <Thumbnail
          error={fieldsCheck.includes("thumbnail")}
          url={thumbnail}
          loading={loadingThumbnail}
          onChange={uploadThumbnail}
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

        <ButtonCheck
          title={t("CreateCategoryPage.field.public")}
          name="public"
          width="w-fit"
          isChecked={data.public}
          onChange={changePublic}
        />
      </div> */}

      <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3"></div>
    </div>
  );
};

export default CategoryForm;

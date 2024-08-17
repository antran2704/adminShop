import { useState, useEffect, useCallback, ReactNode } from "react";
import { message, Switch, TreeSelect, TreeSelectProps, UploadFile } from "antd";
import { DefaultOptionType, SelectProps } from "antd/es/select";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import {
  ICreateProduct,
  IParentCategory,
  IProduct,
  IResponse,
  IResponseWithPagination,
} from "~/interface";
import { ECompressFormat, ETypeImage } from "~/enums";
import { ETypeFile } from "~/enums/file";

import Specifications from "~/components/Specifications";
import {
  getChildInCategory,
  getParentCategories,
  getParentCategory,
  uploadThumbnailProduct,
} from "~/api-client";

import { InputNumber, InputText, InputTextArea } from "../Core/Input";
import { SelectFilterCore } from "../Core";
import { UploadGallery, UploadImage } from "../Core/Upload";
import { formatBigNumber } from "~/helper/format/number";

interface Props {
  data?: IProduct | null;
  galleryFile?: UploadFile[];
  form: UseFormReturn<ICreateProduct, any, undefined>;
  disableEditInventory?: boolean;
  onUploadGallery: (source: UploadFile | null) => void;
  onRemoveGallery: (source: UploadFile | null) => void;
}

const FormProduct = (props: Props) => {
  const {
    form,
    galleryFile = [],
    data,
    disableEditInventory = false,
    onUploadGallery,
    onRemoveGallery,
  } = props;

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
  } = form;

  const t = useTranslations("ProductPage");
  const tError = useTranslations("Error");

  // Category
  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, "label">[]>([
    {
      id: 0,
      pId: null,
      value: "home",
      title: "Home",
      disabled: true,
    },
  ]);
  const [optionCategory, setOptionCategory] = useState<SelectProps["options"]>(
    [],
  );

  const [loading, setLoading] = useState<{
    thumbnail: boolean;
    gallery: boolean;
  }>({
    gallery: false,
    thumbnail: false,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const onSelectTree = (items: string[], labels: string[]) => {
    const data: SelectProps["options"] = items.map(
      (item: string, index: number) => ({ label: labels[index], value: item }),
    );

    setOptionCategory(data);
  };

  const onRemoveSelectTree = (value: string) => {
    const category: string = getValues("category");

    if (category && value === category) {
      setValue("category", "");
    }
  };

  const uploadThumbnail = useCallback(
    async (source: File | null) => {
      if (!source) {
        setValue("thumbnail", "");
        return;
      }

      if (errors.thumbnail?.message) {
        clearErrors("thumbnail");
      }

      const formData: FormData = new FormData();
      formData.append("image", source);

      setLoading({ ...loading, thumbnail: true });
      uploadThumbnailProduct(formData)
        .then(({ status, payload }: IResponse<string>) => {
          if (status === 201) {
            setValue("thumbnail", payload);
          }
        })
        .catch(() => {
          messageApi.error(tError("UPLOAD_IMAGE"));
        });

      // setLoading({ ...loading, thumbnail: false });
    },
    [getValues("thumbnail"), errors.thumbnail],
  );

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
          disabled: true,
        };

        data.push(itemTree);
        handleGetFirstTime(res.payload.parent_id, data);
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

        if (data && !!data.categories.length) {
          data.categories.forEach((item: IParentCategory) => {
            if (!item.parent_id) return;

            listTree.push({
              id: item._id,
              pId: item.parent_id,
              value: item._id,
              title: item.title,
              isLeaf: !item.children.length,
            });
          });
        }

        setTreeData([...treeData, ...listTree]);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (!data) return;

    if (!!data.categories.length) {
      const itemSelectCategories: string[] = data.categories.map(
        (item) => item._id,
      );
      const labelSelectCategories: string[] = data.categories.map(
        (item) => item.title,
      );

      onSelectTree(itemSelectCategories, labelSelectCategories);
    }
  }, [data]);

  useEffect(() => {
    handleGetCategoriesParent();
  }, []);

  return (
    <div className="w-full">
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

        {/* short description */}
        <div
          className={clsx("relative w-full", [
            errors.shortDescription && "pb-2",
          ])}>
          <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => (
              <InputTextArea
                title={t("form.shortDescription")}
                error={!!errors.shortDescription}
                rows={2}
                placeholder={t("placeholder.overview")}
                {...field}
              />
            )}
          />
          {errors.shortDescription?.message && (
            <p className="absolute text-sm text-error">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* description */}
        <div
          className={clsx("relative w-full", [errors.description && "pb-2"])}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <InputTextArea
                title={t("form.description")}
                error={!!errors.description}
                rows={2}
                placeholder={t("placeholder.description")}
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
      </div>

      <div className="w-full flex flex-col p-5 mt-5 bg-white rounded-md border-2 gap-5">
        {/* categories */}
        <div className={clsx("relative w-full", [errors.categories && "pb-2"])}>
          <p
            className={clsx("text-base pb-2", [
              errors.categories && "text-error",
            ])}>
            {t("form.categories")}
          </p>
          <Controller
            name="categories"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <TreeSelect
                treeLine
                treeDataSimpleMode
                multiple
                style={{ width: "100%" }}
                value={value || undefined}
                size="large"
                status={!!errors.categories?.message ? "error" : ""}
                treeDefaultExpandedKeys={[
                  "home",
                  //   category?.parent_id ? category.parent_id : "",
                ]}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder={t("placeholder.categories")}
                treeData={treeData}
                loadData={onLoadChildCategory}
                onDeselect={onRemoveSelectTree}
                onChange={(values: string[], labels: ReactNode[]) => {
                  onChange(values);
                  onSelectTree(values, labels as string[]);
                }}
                {...rest}
              />
            )}
          />
          {errors.categories?.message && (
            <p className="absolute text-sm text-error">
              {errors.categories.message}
            </p>
          )}
        </div>

        {/* category */}
        <div className={clsx("relative w-full", [errors.categories && "pb-2"])}>
          <p
            className={clsx("text-base pb-2", [
              errors.category && "text-error",
            ])}>
            {t("form.category")}
          </p>
          <Controller
            name="category"
            control={control}
            render={({ field: { value, ...rest } }) => (
              <SelectFilterCore
                showSearch
                placeholder={t("placeholder.category")}
                filterOption={(input, option) =>
                  ((option?.label as string) ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                status={!!errors.category?.message ? "error" : ""}
                options={optionCategory}
                value={value || null}
                {...rest}
              />
            )}
          />
          {errors.category?.message && (
            <p className="absolute text-sm text-error">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* <SelectItem
          width="w-full"
          title={t("CreateProductPage.field.defaultCategory")}
          name="category"
          value={defaultCategory ? defaultCategory : ""}
          onSelect={onSelectDefaultCategory}
          data={mutipleCategories}
        /> */}
      </div>

      <div className="w-full flex flex-col p-5 mt-5 bg-white rounded-md border-2 gap-5">
        {/* Thumbnail */}
        <div className={clsx("relative", [errors.thumbnail && "pb-2"])}>
          <Controller
            name="category"
            control={control}
            render={({ field: { value } }) => (
              <UploadImage
                title={t("form.thumbnail")}
                height={200}
                width={200}
                className=""
                rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
                src={
                  data?.thumbnail
                    ? (process.env.NEXT_PUBLIC_IMAGE_ENDPOINT as string) +
                      data.thumbnail
                    : ""
                }
                error={!!errors.thumbnail?.message}
                onChangeImage={uploadThumbnail}
                option={{
                  quality: 100,
                  maxHeight: 200,
                  maxWidth: 200,
                  minHeight: 200,
                  minWidth: 200,
                  compressFormat: ECompressFormat.WEBP,
                  type: ETypeImage.file,
                }}
              />
            )}
          />
          {errors.thumbnail?.message && (
            <p className="absolute text-sm text-error">
              {errors.thumbnail.message}
            </p>
          )}
        </div>

        {/* Gallery */}
        <div className="relative">
          <Controller
            name="category"
            control={control}
            render={() => (
              <UploadGallery
                title={t("form.gallery")}
                data={galleryFile}
                maxFile={6}
                rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
                onChangeFile={onUploadGallery}
                onRemoveFile={onRemoveGallery}
              />
            )}
          />

          {errors.gallery?.message && (
            <p className="absolute text-sm text-error">
              {errors.gallery.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col p-5 mt-5 bg-white rounded-md border-2 gap-5">
        {/* Price */}
        <div className="relative">
          <Controller
            name="price"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <InputNumber
                title={t("form.price")}
                width="w-full"
                error={!!errors.price?.message}
                value={formatBigNumber(value)}
                onChangeValue={onChange}
                {...rest}
              />
            )}
          />

          {errors.price?.message && (
            <p className="absolute text-sm text-error">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Promotion price */}
        <div className="relative">
          <Controller
            name="promotion_price"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <InputNumber
                title={t("form.promotionPrice")}
                width="w-full"
                error={!!errors.promotion_price?.message}
                value={formatBigNumber(value)}
                onChangeValue={onChange}
                {...rest}
              />
            )}
          />

          {errors.promotion_price?.message && (
            <p className="absolute text-sm text-error">
              {errors.promotion_price.message}
            </p>
          )}
        </div>

        {/* Inventory */}
        <div className="relative">
          <Controller
            name="inventory"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <InputNumber
                title={t("form.inventory")}
                width="w-full"
                error={!!errors.inventory?.message}
                value={formatBigNumber(value)}
                disabled={disableEditInventory}
                onChangeValue={onChange}
                {...rest}
              />
            )}
          />

          {errors.inventory?.message && (
            <p className="absolute text-sm text-error">
              {errors.inventory.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col p-5 mt-5 bg-white rounded-md border-2 gap-5">
        {/* SKU */}
        <div className={clsx("relative w-full", [errors.title && "pb-2"])}>
          <Controller
            name="sku"
            control={control}
            render={({ field: { value, ...rest } }) => (
              <InputText
                title={t("form.sku")}
                width="w-full"
                error={!!errors.sku}
                placeholder={t("placeholder.sku")}
                value={value ? value : ""}
                {...rest}
              />
            )}
          />
          {errors.sku?.message && (
            <p className="absolute text-sm text-error">{errors.sku.message}</p>
          )}
        </div>

        {/* Barcode*/}
        <div className={clsx("relative w-full", [errors.title && "pb-2"])}>
          <Controller
            name="barcode"
            control={control}
            render={({ field: { value, ...rest } }) => (
              <InputText
                title={t("form.barcode")}
                width="w-full"
                error={!!errors.barcode}
                placeholder={t("placeholder.barcode")}
                value={value ? value : ""}
                {...rest}
              />
            )}
          />
          {errors.barcode?.message && (
            <p className="absolute text-sm text-error">
              {errors.barcode.message}
            </p>
          )}
        </div>
      </div>

      {/* Specification */}
      <div className="w-full flex flex-col p-5 mt-5 bg-white rounded-md border-2 gap-5">
        <Controller
          name="specifications"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Specifications specifications={value} onUpdate={onChange} />
          )}
        />
      </div>

      <div className="w-full p-5 mt-5 bg-white rounded-md border-2 lg:gap-5 gap-3">
        <p className={clsx("text-base pb-2")}>{t("form.status")}</p>

        <Controller
          name="public"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch value={value} onChange={onChange} />
          )}
        />
      </div>

      {/* {loading && <SpinLoading className="text-3xl" />} */}

      {/* Message of Antd */}
      {contextHolder}
    </div>
  );
};

export default FormProduct;

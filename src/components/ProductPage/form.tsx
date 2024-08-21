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
  deleteProduct,
  getChildInCategory,
  getParentCategories,
  uploadThumbnailProduct,
} from "~/api-client";

import { InputNumber, InputText, InputTextArea } from "../Core/Input";
import { SelectFilterCore } from "../Core";
import { UploadGallery, UploadImage } from "../Core/Upload";
import { formatBigNumber } from "~/helper/format/number";
import { ModalConfirm } from "../Modal";
import { BtnDelete } from "../Button";
import { useRouter } from "next/router";

interface Props {
  product?: IProduct | null;
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
    product,
    disableEditInventory = false,
    onUploadGallery,
    onRemoveGallery,
  } = props;

  const t = useTranslations("ProductPage");
  const tCommon = useTranslations("Common");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
  } = form;

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

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<{
    thumbnail: boolean;
    gallery: boolean;
    delete: boolean;
  }>({
    gallery: false,
    thumbnail: false,
    delete: false,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const onDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

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

  // hanlde get child in a category
  const onLoadChildCategory: TreeSelectProps["loadData"] = async ({
    id: parentId,
  }) => {
    handleGetChildCategory(parentId);
  };

  const onDelete = async (productId: string) => {
    if (!productId) return;

    setLoading({ ...loading, delete: true });

    try {
      await deleteProduct(productId);
      setDeleteModal(false);
      messageApi.success(tSuccess("delete"));

      router.push("/categories");
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
      setLoading({ ...loading, delete: false });
    }
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

        if (product && !!product.categories.length) {
          product.categories.forEach((item: IParentCategory) => {
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
    if (!product) return;

    if (!!product.categories.length) {
      const itemSelectCategories: string[] = product.categories.map(
        (item) => item._id,
      );
      const labelSelectCategories: string[] = product.categories.map(
        (item) => item.title,
      );

      onSelectTree(itemSelectCategories, labelSelectCategories);
    }
  }, [product]);

  useEffect(() => {
    handleGetCategoriesParent();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col py-5 gap-5">
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

      <div className="w-full flex flex-col py-5 border-t-2 gap-5">
        {/* categories */}
        <div className={clsx("relative w-full", [errors.categories && "pb-2"])}>
          <p
            className={clsx("text-base pb-2 dark:text-darkInput", [
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
                treeDefaultExpandedKeys={["home"]}
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
            className={clsx("text-base pb-2 dark:text-darkInput", [
              errors.category && "text-error",
            ])}>
            {t("form.category")}
          </p>

          {product && (
            <ul className="flex items-center text-sm pb-2 gap-2">
              <li>{`Home >`}</li>
              {product.breadcrumbs.map((item) => (
                <li key={item._id}>{`${item.title} > `}</li>
              ))}
              <li>{product.title}</li>
            </ul>
          )}
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
      </div>

      <div className="w-full flex flex-col py-5 border-t-2 gap-5">
        {/* Thumbnail */}
        <div className={clsx("relative", [errors.thumbnail && "pb-2"])}>
          <UploadImage
            title={t("form.thumbnail")}
            height={200}
            width={200}
            className=""
            rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
            src={
              product?.thumbnail
                ? (process.env.NEXT_PUBLIC_IMAGE_ENDPOINT as string) +
                  product.thumbnail
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
          {errors.thumbnail?.message && (
            <p className="absolute text-sm text-error">
              {errors.thumbnail.message}
            </p>
          )}
        </div>

        {/* Gallery */}
        <div className="relative">
          <Controller
            name="gallery"
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

      <div className="w-full flex flex-col py-5 border-t-2 gap-5">
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

      <div className="w-full flex flex-col py-5 border-t-2 gap-5">
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
      <div className="w-full flex flex-col py-5 border-t-2 gap-5">
        <Controller
          name="specifications"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Specifications specifications={value} onUpdate={onChange} />
          )}
        />
      </div>

      <div className="w-full flex flex-col py-5 border-t-2 gap-5">
        <div>
          <p className={clsx("text-base pb-2 dark:text-darkInput")}>
            {t("form.status")}
          </p>

          <Controller
            name="public"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch value={value} onChange={onChange} />
            )}
          />
        </div>

        {/* Delete */}
        {product && (
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
      </div>

      {/* Modal delete */}
      <ModalConfirm
        title={t("modalDelete.title")}
        open={deleteModal}
        onCancel={onDeleteModal}
        centered
        type="error"
        destroyOnClose
        onOk={() => onDelete(product?._id as string)}
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

export default FormProduct;

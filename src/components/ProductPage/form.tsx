import { useState, useEffect, useCallback, ReactNode } from "react";

import {
  ICreateProduct,
  IParentCategory,
  IResponse,
  IResponseWithPagination,
  ISpecificationsProduct,
} from "~/interface";
import Specifications from "~/components/Specifications";
import {
  getChildInCategory,
  getParentCategories,
  getParentCategory,
  uploadThumbnailProduct,
} from "~/api-client";
import { ECompressFormat, ETypeImage } from "~/enums";
import { message, TreeSelect, TreeSelectProps } from "antd";
import { Controller, UseFormReturn } from "react-hook-form";
import { InputText, InputTextArea } from "../Core/Input";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { DefaultOptionType, SelectProps } from "antd/es/select";
import { SelectFilterCore } from "../Core";
import { UploadImage } from "../Core/Upload";

interface Props {
  data?: ICreateProduct | null;
  form: UseFormReturn<ICreateProduct, any, undefined>;
}

const FormProduct = (props: Props) => {
  const { form } = props;

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
  } = form;

  const t = useTranslations("ProductPage");

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
  const [defaultCategory, setDefaultCategory] = useState<string | null>(null);

  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [gallery, setGallery] = useState<string[]>([]);

  const [specifications, setSpecifications] = useState<
    ISpecificationsProduct[]
  >([]);

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

  const onSelectDefaultCategory = useCallback(
    (value: string) => {
      setDefaultCategory(value);
    },
    [defaultCategory],
  );

  const uploadThumbnail = useCallback(
    async (source: File) => {
      if (source) {
        const formData: FormData = new FormData();
        formData.append("image", source);

        setLoading({ ...loading, thumbnail: true });

        try {
          const { status, payload } = await uploadThumbnailProduct(formData);

          if (status === 201) {
            setThumbnail(payload);
          }
        } catch (error) {
          console.log(error);
        }

        setLoading({ ...loading, thumbnail: false });
      }
    },
    [thumbnail, loading],
  );

  const onUploadGallery = useCallback(
    async (source: File) => {
      if (source) {
        const formData: FormData = new FormData();
        formData.append("image", source);
        setLoading({ ...loading, gallery: true });

        try {
          const { status, payload } = await uploadThumbnailProduct(formData);

          if (status === 201) {
            setGallery([...gallery, payload]);
          }
        } catch (error) {
          console.log(error);
        }

        setLoading({ ...loading, gallery: false });
      }
    },
    [gallery, loading],
  );

  const onRemoveGallary = useCallback(
    async (url: string) => {
      try {
        const newGallery = gallery.filter((image) => image !== url);
        setGallery(newGallery);
      } catch (error) {
        console.log(error);
      }
    },
    [gallery, loading],
  );

  const onUpdateSpecifications = (
    newSpecifications: ISpecificationsProduct[],
  ) => {
    setSpecifications(newSpecifications);
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

        setTreeData([...treeData, ...listTree]);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    handleGetCategoriesParent();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
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

      <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
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

      <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
        <UploadImage
          title={t("form.thumbnail")}
          height={200}
          width={200}
          className=""
          // src={value ? process.env.NEXT_PUBLIC_IMAGE_ENDPOINT + value : ""}
          error={!!errors.thumbnail?.message}
          onChangeImage={() => {}}
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

        {/* <Thumbnail
          url={thumbnail}
          loading={loadingThumbnail}
          onChange={uploadThumbnail}
          option={{
            quality: 100,
            maxHeight: 200,
            maxWidth: 200,
            minHeight: 200,
            minWidth: 200,
            compressFormat: ECompressFormat.WEBP,
            type: ETypeImage.file,
          }}
          className="lg:min-h-[400px] md:min-h-[300px] min-h-[200px]"
        />

        <Gallery
          gallery={gallery}
          loading={loadingGallery}
          limited={6}
          onChange={onUploadGallery}
          onDelete={onRemoveGallary}
          option={{
            quality: 90,
            maxHeight: 680,
            maxWidth: 680,
            minHeight: 680,
            minWidth: 680,
            compressFormat: ECompressFormat.JPEG,
            type: ETypeImage.file,
          }}
        /> */}
      </div>

      {/* <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
        <InputNumber
          title={t("CreateProductPage.field.price")}
          width="w-full"
          error={fieldsCheck.includes("price")}
          value={formatBigNumber(product.price)}
          name="price"
          getValue={changePrice}
        />

        <InputNumber
          title={t("CreateProductPage.field.promotionPrice")}
          width="w-full"
          value={formatBigNumber(product.promotion_price)}
          error={fieldsCheck.includes("promotion_price")}
          name="promotion_price"
          getValue={changePrice}
        />

        <InputNumber
          title={t("CreateProductPage.field.inventory")}
          width="w-full"
          value={formatBigNumber(product.inventory)}
          error={fieldsCheck.includes("inventory")}
          name="inventory"
          getValue={changePrice}
        />
      </div> */}

      {/* <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
        <InputText
          title={t("CreateProductPage.field.SKU")}
          width="w-full"
          value={product.sku || ""}
          error={fieldsCheck.includes("sku")}
          placeholder="SKU..."
          name="sku"
          getValue={changeValue}
          infor="Mã SKU giúp quản lí sản phẩm tốt hơn"
        />

        <InputText
          title={t("CreateProductPage.field.barcode")}
          width="w-full"
          value={product.barcode || ""}
          error={fieldsCheck.includes("barcode")}
          name="barcode"
          placeholder="Bar code..."
          getValue={changeValue}
        />
      </div> */}

      <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
        <Specifications
          specifications={specifications}
          onUpdate={onUpdateSpecifications}
        />
      </div>

      {/* <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
        <ButtonCheck
          title={t("CreateProductPage.field.public")}
          name="public"
          width="w-fit"
          isChecked={product.public}
          onChange={changePublic}
        />
      </div> */}

      {/* {loading && <SpinLoading className="text-3xl" />} */}
    </div>
  );
};

export default FormProduct;

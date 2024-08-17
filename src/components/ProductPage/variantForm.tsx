import { Fragment, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  IAttribute,
  IOptionProduct,
  IProduct,
  IResponseWithPagination,
  ISearchAttribute,
  ISelectItem,
  IVariantProduct,
} from "~/interface";

import { useTranslations } from "next-intl";
import Popup from "../Popup";
import { useRouter } from "next/router";
import { ORDER_PARAMATER_ENUM } from "~/enums";
import { getAttributes } from "~/api-client";
import { SelectProps } from "antd";
import { SelectFilterCore } from "../Core";
import { DefaultOptionType } from "antd/es/select";
import VariantTable from "./VariantTable";

interface ICompination {
  [key: string]: string[];
}

interface ISelectAttributeItem {
  [key: string]: string[];
}

const initVariant: IVariantProduct = {
  _id: "",
  product_id: "",
  title: "",
  barcode: "",
  available: true,
  price: 0,
  promotion_price: 0,
  sku: null,
  option1: null,
  option2: null,
  option3: null,
  options: [],
  thumbnail: null,
  url: null,
  inventory: 0,
  sold: 0,
  public: true,
};

interface Props {
  product: IProduct;
  variants: IVariantProduct[];
  options: IOptionProduct[];
  onRemoveAll: (value: boolean) => void;
  handleChangeOption: (items: IOptionProduct[]) => void;
  handleChangeVariants: (items: IVariantProduct[]) => void;
}

const VariantForm = (props: Props) => {
  const {
    product,
    variants,
    options,
    onRemoveAll,
    handleChangeVariants,
    handleChangeOption,
  } = props;

  const t = useTranslations("ProductPage");
  const router = useRouter();

  const [attributeParamater, setAttributeParamater] =
    useState<ISearchAttribute>({
      page: 1,
      take: 10,
      order: ORDER_PARAMATER_ENUM.DESC,
      public: true,
    });

  const [attributesV2, setAtrributesV2] = useState<IAttribute[]>([]);
  const [selectAttributeIds, setSelectAtrributesIds] = useState<string[]>([]);

  const [selectAttributesV2, setSelectAttributesV2] = useState<
    SelectProps["options"]
  >([]);
  const [selectAttributeItemV2, setSelectAttributeItemV2] =
    useState<ISelectAttributeItem>({});

  const [selectVariant, setSelectVariant] = useState<ISelectItem | null>(null);
  const [showPopupVariant, setPopupVariant] = useState<boolean>(false);

  const [showPopupClearVariants, setShowClearVariants] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const onShowPopupVariant = (variant: IVariantProduct | null = null) => {
    if (variant) {
      setSelectVariant({ _id: variant._id as string, title: variant.title });
    } else {
      setSelectVariant(null);
    }

    setPopupVariant(!showPopupVariant);
  };

  const onClearVariants = () => {
    onRemoveAll(true);
    handleChangeVariants([]);
  };

  const onGenerateVariants = () => {
    const compination = selectAttributeItemV2;
    const options = selectAttributesV2 as DefaultOptionType[];
    const keys = Object.keys(compination);
    if (keys.length === 0) {
      //   toast.error("Please select attribute", {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      //   return;
    }

    const result = handleGenerateVariants(
      compination,
      keys,
      initVariant,
      [],
      0,
    );

    const newOption: IOptionProduct[] = options.map((option) => ({
      code: option.title as string,
      name: option.label as string,
      values: option.children as string[],
    }));

    onRemoveAll(true);
    handleChangeOption(newOption);
    handleChangeVariants(result);
  };

  const handleGenerateVariants = (
    compination: ICompination,
    keys: string[],
    variant: IVariantProduct,
    result: IVariantProduct[],
    index: number,
  ) => {
    if (index > keys.length - 1) {
      variant.title = `${product.title} ${variant.options.join(" / ")}`;
      variant._id = `new-${uuidv4()}`;
      variant.product_id = product._id as string;
      result.push(variant);

      return result;
    }

    const key = keys[index];
    const items = compination[key];
    const optionKey =
      index === 0 ? "option1" : index === 1 ? "option2" : "option3";

    for (const item of items) {
      variant[optionKey] = item;
      const newVariants = handleGenerateVariants(
        compination,
        keys,
        { ...variant, options: [...variant.options, item] },
        result,
        index + 1,
      );

      result = newVariants;
    }

    return result;
  };

  // v2
  const onSelectAttribute = (
    values: string[],
    options: DefaultOptionType | DefaultOptionType[],
  ) => {
    const newSelectItems: ISelectAttributeItem = {};

    options.forEach((option: DefaultOptionType) => {
      const keyOfSelectAttribute = option.title as keyof ISelectAttributeItem;

      if (selectAttributeItemV2[keyOfSelectAttribute]) {
        newSelectItems[keyOfSelectAttribute] =
          selectAttributeItemV2[keyOfSelectAttribute];
      }
    });

    setSelectAtrributesIds(values);
    setSelectAttributesV2(options as DefaultOptionType[]);
    setSelectAttributeItemV2(newSelectItems);
  };

  // v2
  const onSelectAttributeItem = (
    values: string[],
    key: keyof typeof selectAttributeItemV2,
  ) => {
    const newSelectItems: ISelectAttributeItem = { ...selectAttributeItemV2 };

    if (!values.length) {
      delete newSelectItems[key];
    } else {
      newSelectItems[key] = values;
    }

    setSelectAttributeItemV2(newSelectItems);
  };

  // v2
  const handleGetAttributes = async () => {
    setLoading(true);

    await getAttributes(attributeParamater).then(
      ({ payload }: IResponseWithPagination<IAttribute[]>) => {
        setAtrributesV2(payload);
      },
    );

    setLoading(false);
  };

  const onRemoveVariant = (id: string) => {
    const newVariants = variants.filter(
      (variant: IVariantProduct) => variant._id !== id,
    );

    handleChangeVariants(newVariants);
    setPopupVariant(false);
  };

  useEffect(() => {
    handleGetAttributes();
  }, []);

  return (
    <div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
        <SelectFilterCore
          showSearch
          mode="multiple"
          filterOption={(input, option) =>
            ((option?.label as string) ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={attributesV2.map((item: IAttribute) => ({
            value: item._id,
            label: item.name,
            title: item.code,
            children: item.children.map((child) => child.name) as any,
          }))}
          value={selectAttributeIds}
          onChange={onSelectAttribute}
        />

        {selectAttributesV2?.map(
          (attribute: DefaultOptionType, index: number) => (
            <SelectFilterCore
              key={index}
              showSearch
              mode="multiple"
              options={(attribute?.children as any[]).map((item) => ({
                label: item,
                value: item,
              }))}
              filterOption={(input, option) =>
                ((option?.label as string) ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(values) =>
                onSelectAttributeItem(values, attribute.title as string)
              }
              value={
                selectAttributeItemV2[
                  attribute.title as keyof ISelectAttributeItem
                ]
              }
            />
          ),
        )}
      </div>

      <div className="flex items-center justify-end mt-5 gap-5">
        {Object.keys(selectAttributeItemV2).length > 0 && (
          <button
            onClick={onGenerateVariants}
            className="text-sm bg-success text-white px-5 py-2 rounded-md">
            {t("compination.generate")}
          </button>
        )}

        {variants.length > 0 && (
          <Fragment>
            <button
              onClick={() => setShowClearVariants(!showPopupClearVariants)}
              className="text-sm bg-error text-white px-5 py-2 rounded-md">
              {t("compination.clear")}
            </button>

            {showPopupClearVariants && (
              <Popup
                title="Variants"
                show={showPopupClearVariants}
                onClose={() => setShowClearVariants(!showPopupClearVariants)}>
                <div>
                  <p className="text-lg">Do you want clear all variants</p>
                  <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-2">
                    <button
                      onClick={() =>
                        setShowClearVariants(!showPopupClearVariants)
                      }
                      className="lg:w-fit w-full text-lg hover:text-white font-medium bg-[#e5e5e5] hover:bg-primary px-5 py-1 rounded-md transition-cus">
                      Cancle
                    </button>
                    <button
                      onClick={onClearVariants}
                      className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md">
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </Fragment>
        )}
      </div>

      {variants.length > 0 && (
        <div className="mt-5">
          {/* <Table
            colHeadTabel={colHeaderVariants[router.locale as string]}
            loading={loading}>
            <Fragment>
              {variants.map((variant: IVariantProduct, index: number) => (
                <tr
                  id={`item-${variant._id}`}
                  key={variant._id}
                  className={`border-b ${
                    variant.inventory <= 0 ? "" : ""
                  } hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-white border-b border-gray-300`}>
                  <CelTable
                    type={typeCel.SELECT_IMAGE}
                    images={[]}
                    name="thumbnail"
                    thumbnailUrl={variant.thumbnail}
                    onChangeImage={(name: string, value: string) =>
                      onChangeValueVariant(name, value, index)
                    }
                  />

                  <CelTable
                    type={typeCel.TEXT}
                    value={variant.title}
                    name="title"
                  />
                  <CelTable
                    type={typeCel.INPUT}
                    placeholder="SKU"
                    className="min-w-[140px]"
                    name="sku"
                    value={(variant.sku as string) || ""}
                    onChangeInput={(name: string, value: string) =>
                      onChangeValueVariant(name, value, index)
                    }
                  />
                  <CelTable
                    type={typeCel.INPUT}
                    className="min-w-[140px]"
                    placeholder="Barcode"
                    name="barcode"
                    value={variant.barcode || ""}
                    onChangeInput={(name: string, value: string) =>
                      onChangeValueVariant(name, value, index)
                    }
                  />
                  <CelTable
                    type={typeCel.INPUT_NUMBER}
                    placeholder="Price"
                    className="min-w-[140px]"
                    name="price"
                    value={formatBigNumber(variant.price)}
                    onChangeInputNumber={(name: string, value: number) =>
                      onChangeNumberVariant(name, value, index)
                    }
                  />
                  <CelTable
                    type={typeCel.INPUT_NUMBER}
                    placeholder="Promotion Price"
                    className="min-w-[140px]"
                    name="promotion_price"
                    value={formatBigNumber(variant.promotion_price)}
                    onChangeInputNumber={(name: string, value: number) =>
                      onChangeNumberVariant(name, value, index)
                    }
                  />
                  <CelTable
                    type={typeCel.INPUT_NUMBER}
                    placeholder="Inventory"
                    className="min-w-[140px]"
                    name="inventory"
                    value={variant.inventory.toString()}
                    onChangeInputNumber={(name: string, value: number) =>
                      onChangeNumberVariant(name, value, index)
                    }
                  />
                  <CelTable type={typeCel.GROUP}>
                    <ButtonDelete onClick={() => onShowPopupVariant(variant)} />
                  </CelTable>
                </tr>
              ))}
            </Fragment>
          </Table> */}

          <VariantTable
            product={product}
            data={variants.map((item) => ({ key: item._id, ...item }))}
            handleChangeVariants={handleChangeVariants}
            getData={() => {}}
          />
        </div>
      )}

      {showPopupVariant && selectVariant && (
        <Popup
          title="Variant"
          show={showPopupVariant}
          img="/popup/trash.svg"
          onClose={() => onShowPopupVariant(null)}>
          <div>
            <p className="text-lg dark:text-darkText">
              Do you want delete variant
              <strong>{" " + selectVariant.title}</strong>
            </p>
            <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-2">
              <button
                onClick={() => onShowPopupVariant()}
                className="lg:w-fit w-full text-lg hover:text-white font-medium bg-[#e5e5e5] hover:bg-primary px-5 py-1 rounded-md transition-cus">
                {t("Action.cancle")}
              </button>
              <button
                onClick={() => onRemoveVariant(selectVariant?._id as string)}
                className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md">
                {t("Action.delete")}
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default VariantForm;

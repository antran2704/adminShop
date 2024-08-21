import { Fragment, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DefaultOptionType } from "antd/es/select";
import { SelectProps } from "antd";
import { useTranslations } from "next-intl";

import {
  IAttribute,
  IOptionProduct,
  IProduct,
  IResponseWithPagination,
  ISearchAttribute,
  IVariantProduct,
} from "~/interface";
import { ORDER_PARAMATER_ENUM } from "~/enums";

import { getAttributes } from "~/api-client";

import Popup from "../Popup";
import { SelectFilterCore } from "../Core";
import VariantTable from "./VariantTable";
import { ModalConfirm } from "../Modal";

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
    onRemoveAll,
    handleChangeVariants,
    handleChangeOption,
  } = props;

  const t = useTranslations("ProductPage");

  const [attributeParamater] = useState<ISearchAttribute>({
    page: 1,
    take: 10,
    order: ORDER_PARAMATER_ENUM.DESC,
    public: true,
  });

  const [attributes, setAtrributes] = useState<IAttribute[]>([]);
  const [selectAttributeIds, setSelectAtrributesIds] = useState<string[]>([]);

  const [selectAttributes, setSelectAttributes] = useState<
    SelectProps["options"]
  >([]);
  const [selectAttributeItemV2, setSelectAttributeItemV2] =
    useState<ISelectAttributeItem>({});

  const [modal, setModal] = useState<{ clearAll: boolean }>({
    clearAll: false,
  });

  const onModal = (key: keyof typeof modal) => {
    setModal({ ...modal, [key]: !modal[key] });
  };

  const onClearVariants = () => {
    onRemoveAll(true);
    handleChangeVariants([]);

    onModal("clearAll");
  };

  const onGenerateVariants = () => {
    const compination = selectAttributeItemV2;
    const options = selectAttributes as DefaultOptionType[];
    const keys = Object.keys(compination);
    if (keys.length === 0) return;

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
      values: option.children as any[],
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
    setSelectAttributes(options as DefaultOptionType[]);
    setSelectAttributeItemV2(newSelectItems);
  };

  // hanlde when select attibutr item
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

  // handle get list attibute: color, size,...
  const handleGetAttributes = async () => {
    await getAttributes(attributeParamater).then(
      ({ payload }: IResponseWithPagination<IAttribute[]>) => {
        setAtrributes(payload);
      },
    );
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
          options={attributes.map((item: IAttribute) => ({
            value: item._id,
            label: item.name,
            title: item.code,
            children: item.children.map((child) => child.name) as any,
          }))}
          value={selectAttributeIds}
          onChange={onSelectAttribute}
        />

        {selectAttributes?.map(
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
          <button
            onClick={() => onModal("clearAll")}
            className="text-sm bg-error text-white px-5 py-2 rounded-md">
            {t("compination.clear")}
          </button>
        )}
      </div>

      {variants.length > 0 && (
        <div className="mt-5">
          <VariantTable
            product={product}
            data={variants.map((item) => ({ key: item._id, ...item }))}
            handleChangeVariants={handleChangeVariants}
            getData={() => {}}
          />
        </div>
      )}

      {/* Modal delete all variant */}
      <ModalConfirm
        title={t("modalDeleteAllVariant.title")}
        open={modal.clearAll}
        onCancel={() => onModal("clearAll")}
        centered
        type="error"
        destroyOnClose
        onOk={onClearVariants}>
        <img
          src="/popup/trash.svg"
          className="size-[200px] mx-auto"
          title="delete image"
          alt="delete image"
        />
        <p className="text-base text-center mb-10">
          {t("modalDeleteVariant.description")}
        </p>
      </ModalConfirm>
    </div>
  );
};

export default VariantForm;

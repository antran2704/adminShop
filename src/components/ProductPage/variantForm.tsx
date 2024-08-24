import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DefaultOptionType } from "antd/es/select";
import { Button, SelectProps } from "antd";
import { useTranslations } from "next-intl";

import {
  IAttribute,
  IAttributeChild,
  IOptionProduct,
  IProduct,
  IResponseWithPagination,
  ISearchAttribute,
  IVariantProduct,
} from "~/interface";
import { ORDER_PARAMATER_ENUM } from "~/enums";

import { getAttributes, getChildAttributes } from "~/api-client";

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
  const tError = useTranslations("Error");

  const [attributeParamater] = useState<ISearchAttribute>({
    page: 1,
    take: 10,
    order: ORDER_PARAMATER_ENUM.DESC,
    public: "true",
  });

  const [attributes, setAttributes] = useState<IAttribute[]>([]);
  const [selectAttributeIds, setSelectAttributesIds] = useState<string[]>([]);

  const [selectAttributes, setSelectAttributes] = useState<
    SelectProps["options"]
  >([]);
  const [selectAttributeItem, setSelectAttributeItem] =
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
    const compination = selectAttributeItem;
    const options = selectAttributes as DefaultOptionType[];
    const keys = Object.keys(compination);
    const newOption: IOptionProduct[] = [];

    for (const option of options) {
      const key = option.value as keyof ISelectAttributeItem;
      if (compination[key] && compination[key].length > 0) {
        newOption.push({
          code: option.title as string,
          name: option.label as string,
          values: compination[key] as any[],
        });
      }
    }

    if (!newOption.length || !keys.length) return;

    const result = handleGenerateVariants(
      compination,
      keys,
      initVariant,
      [],
      0,
    );

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

    if (!items.length) {
      variant.title = `${product.title} ${variant.options.join(" / ")}`;
      variant._id = `new-${uuidv4()}`;
      variant.product_id = product._id as string;
      result.push(variant);

      return result;
    }

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

  const onSelectAttribute = async (
    values: string[],
    options: DefaultOptionType | DefaultOptionType[],
  ) => {
    const newSelectItems: ISelectAttributeItem = {};
    const newOptions: SelectProps["options"] = [];

    for (const option of options as DefaultOptionType[]) {
      // const keyOfSelectAttribute = option.title as keyof ISelectAttributeItem;
      const keyOfSelectAttribute = option.value as keyof ISelectAttributeItem;

      const index: number = (selectAttributes as any[]).findIndex(
        (item) => item.value === keyOfSelectAttribute,
      );

      if (selectAttributeIds.includes(option.value as string)) {
        newSelectItems[keyOfSelectAttribute] =
          selectAttributeItem[keyOfSelectAttribute];

        newOptions.push((selectAttributes as any)[index]);
        continue;
      }

      const childOfAttribute: IResponseWithPagination<IAttributeChild[]> =
        await getChildAttributes(option.value as string, {
          order: ORDER_PARAMATER_ENUM.DESC,
          page: 1,
          take: 100,
        });

      const namesOfChild: string[] = childOfAttribute.payload.map(
        (item: IAttributeChild) => item.name,
      );

      newSelectItems[keyOfSelectAttribute] = [];
      newOptions.push({ ...option, children: namesOfChild as any[] });
    }

    setSelectAttributesIds(values);
    setSelectAttributes(newOptions as DefaultOptionType[]);
    setSelectAttributeItem(newSelectItems);
  };

  // hanlde when select attibutr item
  const onSelectAttributeItem = (
    values: string[],
    key: keyof typeof selectAttributeItem,
  ) => {
    const newSelectItems: ISelectAttributeItem = { ...selectAttributeItem };

    if (!values.length) {
      delete newSelectItems[key];
    } else {
      newSelectItems[key] = values;
    }

    setSelectAttributeItem(newSelectItems);
  };

  // handle get list attibute: color, size,...
  const handleGetAttributes = async () => {
    await getAttributes(attributeParamater).then(
      ({ payload }: IResponseWithPagination<IAttribute[]>) => {
        setAttributes(payload);
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
          }))}
          value={selectAttributeIds}
          placeholder={tError("PLEASE_SELECT")}
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
                onSelectAttributeItem(values, attribute.value as string)
              }
              placeholder={tError("PLEASE_SELECT")}
              value={
                selectAttributeItem[
                  attribute.value as keyof ISelectAttributeItem
                ]
              }
            />
          ),
        )}
      </div>

      <div className="flex items-center justify-end mt-5 gap-5">
        {Object.keys(selectAttributeItem).length > 0 && (
          <Button
            onClick={onGenerateVariants}
            className="text-sm bg-success text-white px-5 py-2 rounded-md">
            {t("compination.generate")}
          </Button>
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

import { Fragment, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  IAttribute,
  IOptionProduct,
  IProduct,
  ISearchAttribute,
  ISelectItem,
  IValueOption,
  IVariant,
  IVariantProduct,
} from "~/interface";

import { SelectMutipleWrap } from "../Select";
import { useTranslations } from "next-intl";
import Popup from "../Popup";
import { CelTable, Table } from "../Table";
import { colHeaderVariants } from "../Table/colHeadTable";
import { useRouter } from "next/router";
import { ORDER_PARAMATER_ENUM, typeCel } from "~/enums";
import { ButtonDelete } from "../Button";
import { formatBigNumber } from "~/helper/format/number";
import { getAttributes } from "~/api-client";

interface IObjAttibute {
  [key: string]: IAttribute;
}

interface IObjectSelectAttribute {
  [key: string]: ISelectItem[];
}

interface ICompination {
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
  rate: 0,
};

interface Props {
  product: IProduct;
  variants: IVariantProduct[];
  removeVariants: string[];
  options: IOptionProduct[];
  handleChangeOption: (items: IOptionProduct[]) => void;
  handleChangeVariants: (items: IVariantProduct[]) => void;
  handleRemoveVariant: (items: string[]) => void;
}

const VariantForm = (props: Props) => {
  const {
    product,
    variants,
    removeVariants,
    options,
    handleChangeVariants,
    handleRemoveVariant,
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

  //   const [optionsProduct, setOptionsProduct] = useState<IOptionProduct[]>([]);

  const [attributes, setAtrributes] = useState<IObjAttibute>({});
  const [showAttributes, setShowAttributes] = useState<IObjectSelectAttribute>(
    {},
  );
  //   const [variants, setVariants] = useState<IVariantProduct[]>([]);
  //   const [removeVariants, setRemoveVariants] = useState<string[]>([]);

  const [selectAttributes, setSelectAttributes] =
    useState<IObjectSelectAttribute>({});

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

  const selectAll = (items: ISelectItem[], key: string) => {
    const select = selectAttributes;

    if (key === "default") {
      const currentShowAttributes = showAttributes;
      Object.keys(attributes).forEach((id: string) => {
        const attribute: IAttribute = attributes[id];
        currentShowAttributes[attribute.code] = [];

        if (items.length > 0) {
          attribute.children.forEach((item: any) => {
            currentShowAttributes[attribute.code].push({
              _id: item._id,
              title: item.name,
            });
          });
        } else {
          select[attribute.code] = [];
          delete currentShowAttributes[attribute.code];
        }

        setShowAttributes({ ...currentShowAttributes });
      });
    }
    select[key] = items;
    setSelectAttributes({ ...select });
  };

  const removeSelect = (items: ISelectItem[], id: string, key: string) => {
    const select = selectAttributes;

    if (key === "default") {
      const currentShowAttributes = showAttributes;
      const item: IAttribute = attributes[id];

      select[item.code] = [];
      delete currentShowAttributes[item.code];
    }

    select[key] = items;
    setSelectAttributes({ ...select });
  };

  const selectAttribute = (item: ISelectItem, key: string) => {
    console.log(item, key);
    const select = selectAttributes;
    const currentShowAttributes = showAttributes;

    if (key === "default") {
      if (Object.keys(showAttributes).length >= 4) {
        // toast.warn("Maximum select attribute", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });

        return;
      }
      console.log(attributes);
      const { children, code } = attributes[item._id as string];
      currentShowAttributes[code] = [];

      for (const item of children) {
        const { _id, name, public: available }: IVariant = item;

        if (available) {
          currentShowAttributes[code].push({ _id, title: name });
        }
      }
    }
    select[key].push(item);
    setShowAttributes(currentShowAttributes);
    setSelectAttributes({ ...select });
  };

  const onClearVariants = () => {
    handleChangeVariants([]);

    if (product.variations.length > 0) {
      let items: string[] = [];
      items = product.variations.map((variant: string) => variant) as string[];

      handleRemoveVariant(items as string[]);
    }
  };

  const onGenerateVariants = () => {
    const compination = getCompination();
    const options = getOptionsProduct();
    const keys = Object.keys(compination);

    console.log("compination", compination);
    console.log("options", options);

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

    // setOptionsProduct(options);
    handleChangeOption(options);
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
      variant._id = uuidv4();
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

  const getOptionsProduct = () => {
    const selects = selectAttributes;
    const result: IOptionProduct[] = [];

    for (const item of selects["default"]) {
      const attribute = attributes[item._id as string];
      const variants = selects[attribute.code];
      let values: IValueOption[] = [];

      for (const variant of variants) {
        values.push({ _id: variant._id as string, label: variant.title });
      }

      result.push({
        code: attribute.code,
        name: attribute.name,
        values,
      });
    }
    return result;
  };

  const getCompination = () => {
    const selects = selectAttributes;
    const result: ICompination = {};

    for (const key of Object.keys(selects)) {
      if (key !== "default" && selects[key].length > 0) {
        result[key] = [];
        const items = selects[key];

        for (const item of items) {
          result[key].push(item.title);
        }
      }
    }

    return result;
  };

  const handleGetAttributes = async () => {
    setLoading(true);

    try {
      const { status, payload } = await getAttributes(attributeParamater);

      if (status === 200) {
        let attributesPayload: IObjAttibute = {};
        let showAttributesDefault: IObjectSelectAttribute = { default: [] };
        let selectAttributesDefault: IObjectSelectAttribute = { default: [] };

        for (const item of payload) {
          const {
            _id,
            name,
            children,
            code,
            public: status,
          } = item as IAttribute;

          attributesPayload[`${_id}`] = {
            _id,
            name,
            children,
            code,
            public: status,
          };

          showAttributesDefault["default"].push({ _id, title: name });
          selectAttributesDefault[code] = [];
        }

        setSelectAttributes(selectAttributesDefault);
        setShowAttributes(showAttributesDefault);
        setAtrributes(attributesPayload);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onChangeValueVariant = (name: string, value: string, index: number) => {
    const currentVariants: IVariantProduct[] = variants;
    const newVariant = { ...currentVariants[index], [name]: value };
    currentVariants[index] = newVariant;

    // setVariants([...currentVariants]);
    handleChangeVariants([...currentVariants]);
  };

  const onChangeNumberVariant = (
    name: string,
    value: number,
    index: number,
  ) => {
    const currentVariants: IVariantProduct[] = variants;
    const newVariant = { ...currentVariants[index], [name]: value };
    currentVariants[index] = newVariant;

    // setVariants([...currentVariants]);
    handleChangeVariants([...currentVariants]);
  };

  const onRemoveVariant = (id: string) => {
    const newVariants = variants.filter(
      (variant: IVariantProduct) => variant._id !== id,
    );
    // setVariants(newVariants);
    handleChangeVariants(newVariants);
    setPopupVariant(false);
    // setRemoveVariants([...removeVariants, id]);
    handleRemoveVariant([...removeVariants, id]);
  };

  useEffect(() => {
    handleGetAttributes();
  }, []);

  return (
    <div>
      <SelectMutipleWrap
        data={showAttributes}
        selects={selectAttributes}
        selectItem={selectAttribute}
        removeItem={removeSelect}
        selectAll={selectAll}
      />

      <div className="flex items-center justify-end mt-5 gap-5">
        {Object.keys(showAttributes).length > 1 && (
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
          <Table
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
          </Table>
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

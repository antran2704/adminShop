import { useRouter } from "next/router";
import {
  useState,
  useEffect,
  useCallback,
  Fragment,
  ReactElement,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import {
  ICategorySelect,
  ISelectItem,
  ISpecificationsProduct,
  IProduct,
  IParentCategory,
  IAttribute,
  IVariant,
  IVariantProduct,
  IOptionProduct,
  IValueOption,
  ICreateProduct,
  IResponse,
  FileType,
} from "~/interface";

import { ECompressFormat, ETypeImage, typeCel } from "~/enums";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import generalBreadcrumbs from "~/helper/generateBreadcrumb";

import FormLayout from "~/layouts/FormLayout";
import { InputNumber, InputText, InputTextarea } from "~/components/InputField";
import Tree from "~/components/Tree";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import Gallery from "~/components/Image/Gallery";
import MultipleValue from "~/components/InputField/MultipleValue";
import { SelectItem, SelectMutipleWrap } from "~/components/Select";
import { colHeaderVariants as colHeadTable } from "~/components/Table/colHeadTable";
import Specifications from "~/components/Specifications";
import Loading from "~/components/Loading";
import { CelTable, Table } from "~/components/Table";
import Popup from "~/components/Popup";
import { ButtonDelete } from "~/components/Button";
import { formatBigNumber } from "~/helper/format/number";
import {
  createVariations,
  deleteProduct,
  getAttributesAvailable,
  getParentCategories,
  getProduct,
  updateProduct,
  updateVariations,
  uploadThumbnailProduct,
} from "~/api-client";
import { generateSlug } from "~/helper/generateSlug";
import LayoutWithHeader from "~/layouts/Private";
import { NextPageWithLayout } from "~/interface/page";
import { ProductForm } from "~/components/ProductPage";
import { array, object, string } from "yup";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { message, UploadFile } from "antd";

enum TYPE_TAG {
  BASIC_INFOR = "basic_infor",
  COMPINATION = "compination",
}

const initData: ICreateProduct = {
  title: "",
  description: "",
  meta_description: "",
  meta_title: "",
  shortDescription: "",
  category: "",
  categories: [],
  price: 0,
  promotion_price: 0,
  inventory: 0,
  public: true,
  thumbnail: null,
  gallery: [],
  hotProduct: false,
  options: [],
  specifications: [],
  variations: [],
  sku: null,
  barcode: null,
  sold: 0,
};

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
  _id: null,
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

const Layout = LayoutWithHeader;

const ProductEditPage: NextPageWithLayout = () => {
  const router = useRouter();
  const productId = router.query.id as string;

  const t = useTranslations("ProductPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const [tag, setTag] = useState<string>(TYPE_TAG.BASIC_INFOR);

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      title: string().trim().required(tError("PLEASE_INPUT")),
      shortDescription: string().trim().required(tError("PLEASE_INPUT")),
      description: string().trim().required(tError("PLEASE_INPUT")),
      categories: array().min(1, tError("PLEASE_SELECT")),
      category: string().trim().required(tError("PLEASE_SELECT")),
      thumbnail: string().required(tError("PLEASE_UPLOAD")),
    });
  }, [router.locale]);

  // form control
  const productForm = useForm<ICreateProduct>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });
  const [product, setProduct] = useState<IProduct | null>(null);
  const [galleryFile, setGalleryFile] = useState<UploadFile[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const [optionsProduct, setOptionsProduct] = useState<IOptionProduct[]>([]);

  const [variants, setVariants] = useState<IVariantProduct[]>([]);
  const [removeVariants, setRemoveVariants] = useState<string[]>([]);

  const [attributes, setAtrributes] = useState<IObjAttibute>({});
  const [showAttributes, setShowAttributes] = useState<IObjectSelectAttribute>(
    {},
  );
  const [selectAttributes, setSelectAttributes] =
    useState<IObjectSelectAttribute>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const [selectVariant, setSelectVariant] = useState<ISelectItem | null>(null);
  const [showPopupVariant, setPopupVariant] = useState<boolean>(false);

  const [showPopupClearVariants, setShowClearVariants] =
    useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  const onShowPopupVariant = (variant: IVariantProduct | null = null) => {
    if (variant) {
      setSelectVariant({ _id: variant._id as string, title: variant.title });
    } else {
      setSelectVariant(null);
    }

    setPopupVariant(!showPopupVariant);
  };

  const onSelectTag = (value: TYPE_TAG) => {
    if (value === TYPE_TAG.COMPINATION) {
      if (Object.keys(attributes).length === 0) {
        handleGetAttributes();
      }
    }

    setTag(value);
  };

  const selectAll = (items: ISelectItem[], key: string) => {
    const select = selectAttributes;

    if (key === "default") {
      const currentShowAttributes = showAttributes;
      Object.keys(attributes).forEach((id: string) => {
        const attribute: IAttribute = attributes[id];
        currentShowAttributes[attribute.code] = [];

        if (items.length > 0) {
          attribute.variants.forEach((item: any) => {
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
    const select = selectAttributes;
    const currentShowAttributes = showAttributes;

    if (key === "default") {
      if (Object.keys(showAttributes).length >= 4) {
        toast.warn("Maximum select attribute", {
          position: toast.POSITION.TOP_RIGHT,
        });

        return;
      }

      const { variants, code } = attributes[item._id as string];
      currentShowAttributes[code] = [];

      for (const variant of variants) {
        const { _id, name, public: available } = variant as IVariant;

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
    setVariants([]);

    if (product.variants.length > 0) {
      let items: string[] = [];
      items = product.variants.map(
        (variant: IVariantProduct) => variant._id,
      ) as string[];

      setRemoveVariants(items as string[]);
    }
  };

  const onGenerateVariants = () => {
    const compination = getCompination();
    const options = getOptionsProduct();
    const keys = Object.keys(compination);

    if (keys.length === 0) {
      toast.error("Please select attribute", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    const result = handleGenerateVariants(
      compination,
      keys,
      initVariant,
      [],
      0,
    );

    setOptionsProduct(options);
    setVariants(result);
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
        values.push({ label: variant.title });
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

  const handleDeleteProduct = async () => {
    if (!product._id) return;

    try {
      await deleteProduct(product._id);
      setShowPopup(false);

      toast.success("Success delete product", {
        position: toast.POSITION.TOP_RIGHT,
      });

      router.push("/products");
    } catch (error) {
      toast.error("Error delete product", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  const onSubmitUpdateProduct = async (
    productId: string,
    values: ICreateProduct,
  ) => {
    if (!productId) return;
    setIsSubmit(true);

    try {
      // let breadcrumbs: string[] = [];
      // if (defaultCategory) {
      //   breadcrumbs = generalBreadcrumbs(defaultCategory, categories);
      // } else {
      //   breadcrumbs = generalBreadcrumbs(mutipleCategories[0]._id, categories);
      // }

      let variations_id: string[] = [];
      let inventory: number = values.inventory;

      // if (removeVariants.length > 0) {
      //   await updateVariations(removeVariants);
      // }

      // if (variants.length > 0) {
      //   const variationsRes = await createVariations(
      //     productId as string,
      //     variants,
      //   );

      //   if (variationsRes.status !== 201) {
      //     toast.error("Error in updated variations", {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });

      //     return;
      //   }

      //   variations_id = variationsRes.payload.map(
      //     (item: IVariantProduct) => item._id,
      //   );

      //   inventory = variationsRes.payload.reduce(
      //     (total: number, item: IVariantProduct) => {
      //       return total + item.inventory;
      //     },
      //     0,
      //   );
      // }

      const dataSend: ICreateProduct = {
        ...values,
        variations: variations_id,
        inventory,
      };

      if (!!galleryFile.length) {
        for (const item of galleryFile) {
          if (product?.gallery?.includes(item.name as string)) continue;

          const formData: FormData = new FormData();
          formData.append("image", item as FileType);

          const res: IResponse<string> = await uploadThumbnailProduct(formData);

          if (res.status === 201) {
            dataSend.gallery.push(res.payload);
          }
        }
      }

      const payload = await updateProduct(productId, dataSend);

      if (payload.status === 201) {
        messageApi.success(tSuccess("create"));
        // router.push("/products");
      }
    } catch (error) {
      messageApi.error("TRY_AGAIN");
    }

    setIsSubmit(false);
  };

  const handleGetData = async (id: string) => {
    setLoading(true);

    try {
      const { payload, status }: IResponse<IProduct> = await getProduct(
        id as string,
      );

      if (status === 200) {
        const { breadcrumbs, category, categories, ...restProduct } = payload;

        const formData: ICreateProduct = {
          ...restProduct,
          category: category._id,
          categories: categories.map((item: IParentCategory) => item._id),
        };

        const gallery: UploadFile[] = payload.gallery.map((item: string) => ({
          uid: uuidv4(),
          name: item,
          url: process.env.NEXT_PUBLIC_IMAGE_ENDPOINT + item,
        }));

        setProduct(payload);
        setGalleryFile(gallery);

        setOptionsProduct(payload.options);
        setVariants(payload.variations);

        productForm.reset(formData);
      }

      setLoading(false);
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const handleGetAttributes = async () => {
    setLoading(true);

    try {
      const { status, payload } = await getAttributesAvailable();

      if (status === 200) {
        let attributesPayload: IObjAttibute = {};
        let showAttributesDefault: IObjectSelectAttribute = { default: [] };
        let selectAttributesDefault: IObjectSelectAttribute = { default: [] };

        for (const item of payload) {
          const {
            _id,
            name,
            variants,
            code,
            public: status,
          } = item as IAttribute;

          attributesPayload[`${_id}`] = {
            _id,
            name,
            variants,
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

    setVariants([...currentVariants]);
  };

  const onChangeNumberVariant = (
    name: string,
    value: number,
    index: number,
  ) => {
    const currentVariants: IVariantProduct[] = variants;
    const newVariant = { ...currentVariants[index], [name]: value };
    currentVariants[index] = newVariant;

    setVariants([...currentVariants]);
  };

  const onRemoveVariant = (id: string) => {
    const newVariants = variants.filter(
      (variant: IVariantProduct) => variant._id !== id,
    );
    setVariants(newVariants);
    setPopupVariant(false);
    setRemoveVariants([...removeVariants, id]);
  };

  const onUploadGallery = async (file: UploadFile | null) => {
    if (!file) return;

    setGalleryFile([...galleryFile, file]);
  };

  const onRemoveGallary = async (file: UploadFile | null) => {
    if (!file) return;

    const newListFile: UploadFile[] = galleryFile.filter(
      (item: UploadFile) => item.uid !== file.uid,
    );

    if (product?.gallery?.includes(file.name as string)) {
      const newGallery: string[] = productForm
        .getValues("gallery")
        .filter((item) => item !== file.name);

      productForm.setValue("gallery", newGallery);
    }

    setGalleryFile(newListFile);
  };

  useEffect(() => {
    if (!productId) return;

    handleGetData(productId);
  }, [productId, router.isReady]);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <FormLayout
      title={`${t("edit")}`}
      backLink="/products"
      onSubmit={productForm.handleSubmit((values) =>
        onSubmitUpdateProduct(productId, values),
      )}
      loading={isSubmit}>
      <Fragment>
        <div className="flex items-center py-5 gap-2">
          <button
            onClick={() => onSelectTag(TYPE_TAG.BASIC_INFOR)}
            className={`text-lg ${
              tag === TYPE_TAG.BASIC_INFOR
                ? "text-success border-success"
                : "dark:text-darkText"
            }  font-medium px-2 pb-2 border-b-2 `}>
            {t("tabs.infomation")}
          </button>
          <button
            onClick={() => onSelectTag(TYPE_TAG.COMPINATION)}
            className={`text-lg ${
              tag === TYPE_TAG.COMPINATION
                ? "text-success border-success"
                : "dark:text-darkText"
            }  font-medium px-2 pb-2 border-b-2 `}>
            {t("tabs.variants")}
          </button>
        </div>

        {tag === TYPE_TAG.BASIC_INFOR && product && (
          <ProductForm
            form={productForm}
            data={product}
            galleryFile={galleryFile}
            onUploadGallery={onUploadGallery}
            onRemoveGallery={onRemoveGallary}
          />
        )}

        {/* {tag === TYPE_TAG.COMPINATION && (
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
                  {t("EditProductPage.compination.generate")}
                </button>
              )}

              {variants.length > 0 && (
                <Fragment>
                  <button
                    onClick={() =>
                      setShowClearVariants(!showPopupClearVariants)
                    }
                    className="text-sm bg-error text-white px-5 py-2 rounded-md">
                    {t("EditProductPage.compination.clear")}
                  </button>

                  {showPopupClearVariants && (
                    <Popup
                      title="Variants"
                      show={showPopupClearVariants}
                      onClose={() =>
                        setShowClearVariants(!showPopupClearVariants)
                      }>
                      <div>
                        <p className="text-lg">
                          Do you want clear all variants
                        </p>
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
                  colHeadTabel={colHeadTable[i18n.resolvedLanguage as string]}
                  message={""}
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
                          images={gallery}
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
                          <ButtonDelete
                            onClick={() => onShowPopupVariant(variant)}
                          />
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
                      onClick={() =>
                        onRemoveVariant(selectVariant?._id as string)
                      }
                      className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md">
                      {t("Action.delete")}
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </div>
        )} */}

        {showPopup && (
          <Popup
            title="Xác nhận xóa sản phẩm"
            img="/popup/trash.svg"
            show={showPopup}
            onClose={handlePopup}>
            <div>
              <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-2">
                <button
                  onClick={handlePopup}
                  className="lg:w-fit w-full text-lg font-medium bg-[#e2e2e2] px-5 py-1 opacity-90 hover:opacity-100 rounded-md transition-cus">
                  {t("Action.cancle")}
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 opacity-90 hover:opacity-100 rounded-md">
                  {t("Action.delete")}
                </button>
              </div>
            </div>
          </Popup>
        )}

        {/* Message of Antd */}
        {contextHolder}
      </Fragment>
    </FormLayout>
  );
};

export default ProductEditPage;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

ProductEditPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback, Fragment, ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import {
  ICategorySelect,
  IObjectCategory,
  ISelectItem,
  ISpecificationsProduct,
  IProductData,
  IParentCategory,
  IAttribute,
  IVariant,
  IVariantProduct,
  IOptionProduct,
  IValueOption,
  ISendProduct,
} from "~/interface";

import { typeCel } from "~/enums";
import { deleteImageInSever } from "~/helper/handleImage";
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
import { formatBigNumber } from "~/helper/number/fomatterCurrency";
import {
  createVariations,
  deleteProduct,
  getAllCategories,
  getAttributesAvailable,
  getParentCategories,
  getProduct,
  updateProduct,
  uploadThumbnailProduct,
} from "~/api-client";
import { generateSlug } from "~/helper/generateSlug";

enum TYPE_TAG {
  BASIC_INFOR = "basic_infor",
  COMPINATION = "compination",
}

const initData: IProductData = {
  _id: null,
  title: "",
  description: "",
  shortDescription: "",
  category: { _id: null, title: "" },
  categories: [],
  type: [],
  price: 0,
  promotion_price: 0,
  inventory: 0,
  public: true,
  thumbnail: null,
  gallery: [],
  brand: null,
  hotProduct: false,
  options: [],
  breadcrumbs: [],
  specifications: [],
  variants: [],
  sku: null,
  barcode: null,
  sold: 0,
  viewer: 0,
  rate: 0,
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

interface Props {
  query: ParsedUrlQuery;
}

const ProductEditPage = (props: Props) => {
  const { query } = props;
  const { id } = query;
  const router = useRouter();

  const [tag, setTag] = useState<string>(TYPE_TAG.BASIC_INFOR);

  const [product, setProduct] = useState<IProductData>(initData);
  const [title, setTitle] = useState<string | null>(null);
  const [categories, setCategories] = useState<IObjectCategory>({});
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);
  const [categoriesParent, setCategoriesParent] = useState([]);
  const [categorySelect, setCategorySelect] = useState<ICategorySelect>({
    title: null,
    node_id: null,
  });

  const [optionsProduct, setOptionsProduct] = useState<IOptionProduct[]>([]);

  const [mutipleCategories, setMultipleCategories] = useState<ISelectItem[]>(
    []
  );
  const [defaultCategory, setDefaultCategory] = useState<string | null>(null);

  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [gallery, setGallery] = useState<string[]>([]);

  const [specifications, setSpecifications] = useState<
    ISpecificationsProduct[]
  >([]);

  const [variants, setVariants] = useState<IVariantProduct[]>([]);
  const [attributes, setAtrributes] = useState<IObjAttibute>({});
  const [showAttributes, setShowAttributes] = useState<IObjectSelectAttribute>(
    {}
  );
  const [selectAttributes, setSelectAttributes] =
    useState<IObjectSelectAttribute>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingGallery, setLoadingGallery] = useState<boolean>(false);

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
        toast.error("Maximum select attribute", {
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
      0
    );

    setOptionsProduct(options);
    setVariants(result);
  };

  const handleGenerateVariants = (
    compination: ICompination,
    keys: string[],
    variant: IVariantProduct,
    result: IVariantProduct[],
    index: number
  ) => {
    if (index > keys.length - 1) {
      variant.title = `${product.title} ${variant.options.join(" / ")}`;
      variant._id = uuidv4();
      variant.product_id = id as string;
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
        index + 1
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

  const onSelectCategory = (title: string | null, node_id: string | null) => {
    if (!node_id) {
      toast.info("Choose another Home category ", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    const isExit = mutipleCategories.some(
      (category) => category.title === title
    );

    if (isExit) {
      toast.info("Oh, category is exited", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    if (!defaultCategory) {
      setDefaultCategory(node_id);
    }

    if (fieldsCheck.includes("categories")) {
      const newFieldsCheck = handleRemoveCheck(fieldsCheck, "categories");
      setFieldsCheck(newFieldsCheck);
    }

    const newItem: ISelectItem = { _id: node_id, title: title as string };

    setCategorySelect({ title, node_id });
    setMultipleCategories([...mutipleCategories, newItem]);
  };

  const changeMultipleCategories = (name: string, values: ISelectItem[]) => {
    if (values.length > 0) {
      const isExit = values.some(
        (value: ISelectItem) => value._id === defaultCategory
      );

      if (!isExit) {
        setDefaultCategory(values[0]._id);
      }
    } else {
      setDefaultCategory(null);
    }
    setMultipleCategories(values);
  };

  const onSelectDefaultCategory = useCallback(
    (value: string) => {
      setDefaultCategory(value);
    },
    [mutipleCategories, defaultCategory]
  );

  const changeValue = useCallback(
    (name: string, value: string) => {
      if (fieldsCheck.includes(name)) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
        setFieldsCheck(newFieldsCheck);
      }
      setProduct({ ...product, [name]: value });
    },
    [product]
  );

  const changePrice = useCallback(
    (name: string, value: number) => {
      if (name === "promotion_price" && product.price <= value) {
        setFieldsCheck([...fieldsCheck, "promotion_price"]);
        toast.error("Promotion price must less than default price", {
          position: toast.POSITION.TOP_RIGHT,
        });

        return;
      }

      if (fieldsCheck.includes(name)) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
        setFieldsCheck(newFieldsCheck);
      }
      setProduct({ ...product, [name]: value });
    },
    [product]
  );

  const changePublic = (name: string, value: boolean) => {
    setProduct({ ...product, [name]: value });
  };

  const uploadThumbnail = useCallback(
    async (source: File) => {
      if (source) {
        if (fieldsCheck.includes("thumbnail")) {
          const newFieldsCheck = handleRemoveCheck(fieldsCheck, "thumbnail");
          setFieldsCheck(newFieldsCheck);
          ("thumbnail");
        }

        const formData: FormData = new FormData();
        formData.append("image", source);
        setLoadingThumbnail(true);

        try {
          const { status, payload } = await uploadThumbnailProduct(formData);

          if (status === 201) {
            setThumbnail(payload);
            setLoadingThumbnail(false);
          }
        } catch (error) {
          toast.error("Upload thumbnail failed", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setLoadingThumbnail(false);
          console.log(error);
        }
      }
    },
    [thumbnail, loadingThumbnail]
  );

  const onUploadGallery = useCallback(
    async (source: File) => {
      if (source) {
        const formData: FormData = new FormData();
        formData.append("image", source);
        setLoadingGallery(true);

        try {
          const { status, payload } = await uploadThumbnailProduct(formData);

          if (status === 201) {
            setGallery([...gallery, payload]);
            setLoadingGallery(false);
          }
        } catch (error) {
          toast.error("Upload image failed", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setLoadingGallery(false);
          console.log(error);
        }
      }
    },
    [gallery, loadingGallery]
  );

  const onRemoveGallary = useCallback(
    async (url: string) => {
      const newGallery = gallery.filter((image) => image !== url);
      setGallery(newGallery);
      // try {
      //   const payload = await deleteImageInSever(url);

      //   if (payload.status === 201) {
      //     const newGallery = gallery.filter((image) => image !== url);
      //     setGallery(newGallery);
      //   }
      // } catch (error) {
      //   toast.error("Remove image failed", {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });

      //   console.log(error);
      // }
    },
    [gallery, loadingGallery]
  );

  const onUpdateSpecifications = useCallback(
    (newSpecifications: ISpecificationsProduct[]) => {
      setSpecifications(newSpecifications);
    },
    [specifications]
  );

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);
    if (fields.length > 0) {
      router.push(`#${fields[0]}`);
    }
    return fields;
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

  const handleOnSubmit = async () => {
    const fields = checkData([
      {
        name: "title",
        value: product.title,
      },
      {
        name: "shortDescription",
        value: product.shortDescription,
      },
      {
        name: "description",
        value: product.description,
      },
      {
        name: "categories",
        value: mutipleCategories,
      },
      {
        name: "thumbnail",
        value: thumbnail,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    try {
      let breadcrumbs: string[] = [];
      if (defaultCategory) {
        breadcrumbs = generalBreadcrumbs(defaultCategory, categories);
      } else {
        breadcrumbs = generalBreadcrumbs(mutipleCategories[0]._id, categories);
      }

      const categoriesProduct = mutipleCategories.map(
        (category: ISelectItem) => {
          return category._id;
        }
      );

      let variations_id: string[] = [];
      let inventory: number = 0;

      if (variants.length > 0) {
        const variationsRes = await createVariations(variants);

        if (variationsRes.status !== 201) {
          toast.error("Error in updated variations", {
            position: toast.POSITION.TOP_RIGHT,
          });

          return;
        }

        variations_id = variationsRes.payload.map(
          (item: IVariantProduct) => item._id
        );

        inventory = variationsRes.payload.reduce(
          (total: number, item: IVariantProduct) => {
            return total + item.inventory;
          },
          0
        );
      } else {
        inventory = product.inventory;
      }

      const sendData: ISendProduct = {
        title: product.title,
        description: product.description,
        shortDescription: product.shortDescription,
        slug: generateSlug(product.title),
        meta_title: product.title,
        meta_description: product.description,
        thumbnail,
        gallery,
        category: defaultCategory as string,
        categories: categoriesProduct as string[],
        breadcrumbs,
        specifications,
        price: product.price,
        promotion_price: product.promotion_price,
        inventory,
        public: product.public,
        variations: variations_id,
        options: optionsProduct,
        sku: product.sku,
        barcode: product.barcode,
      };

      const payload = await updateProduct(id as string, sendData);

      if (payload.status === 201) {
        toast.success("Success updated product", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        router.push("/products");
      }
    } catch (error) {
      toast.error("Error in updated product", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  const handleGetData = async () => {
    setLoading(true);

    try {
      const { payload, status } = await getProduct(id as string);

      const {
        title,
        description,
        shortDescription,
        categories,
        category,
        thumbnail,
        gallery,
        price,
        promotion_price,
        hotProduct,
        inventory,
        brand,
        public: publicProduct,
        rate,
        viewer,
        specifications,
        variations,
        options,
        breadcrumbs,
        sku,
        barcode,
        sold,
      } = payload;

      if (status === 200) {
        let defaultCategoryPayload: IParentCategory | null = null;

        if (category) {
          defaultCategoryPayload = {
            _id: category._id,
            title: category.title,
          };
        } else if (categories.length > 0) {
          defaultCategoryPayload = {
            _id: categories[0]._id,
            title: categories[0].title,
          };
        }

        const multipleCategoriesPayload: ISelectItem[] = categories.map(
          (category: IParentCategory) => ({
            _id: category._id,
            title: category.title,
          })
        );

        const productData: IProductData = {
          _id: id as string,
          title,
          description,
          shortDescription,
          category: defaultCategoryPayload
            ? defaultCategoryPayload
            : initData.category,
          categories: multipleCategoriesPayload,
          thumbnail,
          gallery,
          price,
          promotion_price,
          inventory,
          public: publicProduct,
          hotProduct,
          options,
          breadcrumbs,
          specifications,
          type: [],
          rate,
          viewer,
          brand,
          variants: variations ? variations : [],
          sku,
          barcode,
          sold,
        };
        setProduct(productData);
        setTitle(title);
        setOptionsProduct(options);
        setDefaultCategory(
          defaultCategoryPayload ? defaultCategoryPayload._id : null
        );
        setMultipleCategories(multipleCategoriesPayload);
        setThumbnail(thumbnail);
        setGallery(gallery);
        setSpecifications(specifications);
        setVariants(variations);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
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
      console.log(error);
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    let data: IObjectCategory = {};
    try {
      const response = await getAllCategories({ title: "1", childrens: "1" });

      for (const item of response.payload) {
        const { _id, parent_id, title, childrens, slug } = item;
        data[_id] = { _id, parent_id, title, childrens, slug };
      }

      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetCategoriesParent = async () => {
    try {
      const response = await getParentCategories();
      const data = response.payload.map((item: any) => item._id);
      setCategoriesParent(data);
    } catch (error) {
      console.log(error);
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
    index: number
  ) => {
    const currentVariants: IVariantProduct[] = variants;
    const newVariant = { ...currentVariants[index], [name]: value };
    currentVariants[index] = newVariant;

    setVariants([...currentVariants]);
  };

  const onRemoveVariant = (id: string) => {
    const newVariants = variants.filter(
      (variant: IVariantProduct) => variant._id !== id
    );
    setVariants(newVariants);
    setPopupVariant(false);
  };

  useEffect(() => {
    handleGetData();
    handleGetCategories();
    handleGetCategoriesParent();
  }, []);

  return (
    <FormLayout
      title={`Update Product ${title}`}
      backLink="/products"
      onSubmit={handleOnSubmit}
    >
      <Fragment>
        <div className="flex items-center py-5 gap-2">
          <button
            onClick={() => onSelectTag(TYPE_TAG.BASIC_INFOR)}
            className={`text-lg ${
              tag === TYPE_TAG.BASIC_INFOR ? "text-success border-success" : ""
            }  font-medium px-2 pb-2 border-b-2 `}
          >
            Basic info
          </button>
          <button
            onClick={() => onSelectTag(TYPE_TAG.COMPINATION)}
            className={`text-lg ${
              tag === TYPE_TAG.COMPINATION ? "text-success border-success" : ""
            }  font-medium px-2 pb-2 border-b-2 `}
          >
            Compination
          </button>
        </div>

        {tag === TYPE_TAG.BASIC_INFOR && (
          <div className="lg:w-2/4 w-full mx-auto">
            <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
              <InputTextarea
                title="Title"
                width="w-full"
                value={product.title || ""}
                error={fieldsCheck.includes("title")}
                name="title"
                placeholder="Input product name..."
                rows={2}
                infor="Name of product must less than 120 characters"
                getValue={changeValue}
              />

              <InputTextarea
                title="Short description"
                width="w-full"
                error={fieldsCheck.includes("shortDescription")}
                value={product.shortDescription || ""}
                name="shortDescription"
                placeholder="Input short description about product"
                rows={2}
                getValue={changeValue}
              />

              <InputTextarea
                title="Description"
                width="w-full"
                error={fieldsCheck.includes("description")}
                value={product.description || ""}
                name="description"
                placeholder="Input description about product"
                getValue={changeValue}
              />
            </div>

            <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
              <MultipleValue
                title="Categories"
                width="w-full"
                items={mutipleCategories}
                name="categories"
                infor="Categories select must be different Home Category"
                placeholder="Please select a category or categories"
                readonly={true}
                error={fieldsCheck.includes("categories")}
                getAttributes={changeMultipleCategories}
              />

              <div>
                {categoriesParent.length > 0 &&
                  Object.keys(categories).length > 0 && (
                    <Tree
                      categories={categories}
                      categoriesParent={categoriesParent}
                      node_id="Home"
                      parent_id={null}
                      categorySelect={categorySelect}
                      onSelect={onSelectCategory}
                    />
                  )}
              </div>

              <SelectItem
                width="w-full"
                title="Default category"
                name="category"
                value={defaultCategory ? defaultCategory : ""}
                onSelect={onSelectDefaultCategory}
                data={mutipleCategories}
              />
            </div>

            <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
              <Thumbnail
                error={fieldsCheck.includes("thumbnail")}
                url={thumbnail}
                loading={loadingThumbnail}
                onChange={uploadThumbnail}
              />

              <Gallery
                gallery={gallery}
                loading={loadingGallery}
                limited={6}
                onChange={onUploadGallery}
                onDelete={onRemoveGallary}
              />
            </div>

            <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
              <InputNumber
                title="Price"
                width="w-full"
                error={fieldsCheck.includes("price")}
                value={formatBigNumber(product.price)}
                name="price"
                getValue={changePrice}
              />

              <InputNumber
                title="Promotion Price"
                width="w-full"
                value={formatBigNumber(product.promotion_price)}
                error={fieldsCheck.includes("promotion_price")}
                name="promotion_price"
                getValue={changePrice}
              />

              <InputNumber
                title="Inventory"
                width="w-full"
                readonly={variants.length > 0 ? true : false}
                infor="If product have variations, you can't edit input"
                value={formatBigNumber(product.inventory)}
                error={fieldsCheck.includes("inventory")}
                name="inventory"
                getValue={changePrice}
              />
            </div>

            <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
              <InputText
                title="SKU"
                width="w-full"
                value={product.sku || ""}
                error={fieldsCheck.includes("sku")}
                placeholder="SKU..."
                name="sku"
                getValue={changeValue}
                infor="Mã SKU giúp quản lí sản phẩm tốt hơn"
              />

              <InputText
                title="Barcode"
                width="w-full"
                value={product.barcode || ""}
                error={fieldsCheck.includes("barcode")}
                name="barcode"
                placeholder="Bar code..."
                getValue={changeValue}
              />

              <InputNumber
                title="Sold"
                width="w-full"
                value={product.sold.toString()}
                name="sold"
                readonly={true}
              />
            </div>

            <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
              <Specifications
                specifications={specifications}
                onUpdate={onUpdateSpecifications}
              />
            </div>

            <div className="w-full flex lg:flex-nowrap flex-wrap items-end justify-between mt-5 gap-5">
              {product._id && (
                <ButtonCheck
                  title="Public"
                  name="public"
                  width="w-fit"
                  isChecked={product.public}
                  onChange={changePublic}
                />
              )}

              <button
                onClick={handlePopup}
                className="w-fit text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
              >
                Delete
              </button>
            </div>

            {loading && <Loading />}
          </div>
        )}

        {tag === TYPE_TAG.COMPINATION && (
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
                  className="text-sm bg-success text-white px-5 py-2 rounded-md"
                >
                  Generate Variants
                </button>
              )}

              {variants.length > 0 && (
                <Fragment>
                  <button
                    onClick={() =>
                      setShowClearVariants(!showPopupClearVariants)
                    }
                    className="text-sm bg-success text-white px-5 py-2 rounded-md"
                  >
                    Clear Variants
                  </button>

                  {showPopupClearVariants && (
                    <Popup
                      title="Variants"
                      show={showPopupClearVariants}
                      onClose={() =>
                        setShowClearVariants(!showPopupClearVariants)
                      }
                    >
                      <div>
                        <p className="text-lg">
                          Do you want clear all variants
                        </p>
                        <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-2">
                          <button
                            onClick={() =>
                              setShowClearVariants(!showPopupClearVariants)
                            }
                            className="lg:w-fit w-full text-lg hover:text-white font-medium bg-[#e5e5e5] hover:bg-primary px-5 py-1 rounded-md transition-cus"
                          >
                            Cancle
                          </button>
                          <button
                            onClick={onClearVariants}
                            className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
                          >
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
                  colHeadTabel={colHeadTable}
                  message={""}
                  loading={loading}
                >
                  <Fragment>
                    {variants.map((variant: IVariantProduct, index: number) => (
                      <tr
                        key={variant._id}
                        className="hover:bg-slate-100 border-b border-gray-300"
                      >
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
                onClose={() => onShowPopupVariant(null)}
              >
                <div>
                  <p className="text-lg">
                    Do you want delete variant
                    <strong>{" " + selectVariant.title}</strong>
                  </p>
                  <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-2">
                    <button
                      onClick={() => onShowPopupVariant()}
                      className="lg:w-fit w-full text-lg hover:text-white font-medium bg-[#e5e5e5] hover:bg-primary px-5 py-1 rounded-md transition-cus"
                    >
                      Cancle
                    </button>
                    <button
                      onClick={() =>
                        onRemoveVariant(selectVariant?._id as string)
                      }
                      className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </div>
        )}

        {showPopup && (
          <Popup
            title="Xác nhận xóa sản phẩm"
            show={showPopup}
            onClose={handlePopup}
          >
            <div>
              <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-2">
                <button
                  onClick={handlePopup}
                  className="lg:w-fit w-full text-lg font-medium bg-[#e2e2e2] px-5 py-1 opacity-90 hover:opacity-100 rounded-md transition-cus"
                >
                  Cancle
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 opacity-90 hover:opacity-100 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Fragment>
    </FormLayout>
  );
};

export default ProductEditPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";

import { axiosGet, axiosPost } from "~/ultils/configAxios";

import {
  ICategorySelect,
  IObjectCategory,
  ICreateProduct,
  ISelectItem,
  ISpecificationsProduct,
} from "~/interface";
import { typeInput } from "~/enums";
import { deleteImageInSever, uploadImageOnServer } from "~/helper/handleImage";
import FormLayout from "~/layouts/FormLayout";
import Input from "~/components/Input";
import Tree from "~/components/Tree";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import Gallery from "~/components/Image/Gallery";
import MultipleValue from "~/components/Input/MultipleValue";
import { SelectItem } from "~/components/Select";
import generalBreadcrumbs from "~/helper/generateBreadcrumb";
import Specifications from "~/components/Specifications";
import Loading from "~/components/Loading";
import {
  formatBigNumber,
  revertPriceToString,
} from "~/helper/number/fomatterCurrency";

const initData: ICreateProduct = {
  title: "",
  description: "",
  shortDescription: "",
  category: { _id: null, title: "" },
  categories: [],
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
};

const CreateProductPage = () => {
  const router = useRouter();

  const [product, setProduct] = useState<ICreateProduct>(initData);
  const [categories, setCategories] = useState<IObjectCategory>({});
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);
  const [categoriesParent, setCategoriesParent] = useState([]);
  const [categorySelect, setCategorySelect] = useState<ICategorySelect>({
    title: null,
    node_id: null,
  });

  const [mutipleCategories, setMultipleCategories] = useState<ISelectItem[]>(
    []
  );
  const [defaultCategory, setDefaultCategory] = useState<string | null>(null);

  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [gallery, setGallery] = useState<string[]>([]);

  const [specifications, setSpecifications] = useState<
    ISpecificationsProduct[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingGallery, setLoadingGallery] = useState<boolean>(false);

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
          const { status, payload } = await uploadImageOnServer(
            `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products/uploadImage`,
            formData
          );

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
          const { status, payload } = await uploadImageOnServer(
            `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products/uploadImage`,
            formData
          );

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
      try {
        const payload = await deleteImageInSever(url);

        if (payload.status === 201) {
          const newGallery = gallery.filter((image) => image !== url);
          setGallery(newGallery);
        }
      } catch (error) {
        toast.error("Remove image failed", {
          position: toast.POSITION.TOP_RIGHT,
        });

        console.log(error);
      }
    },
    [gallery, loadingGallery]
  );

  const onUpdateSpecifications = (
    newSpecifications: ISpecificationsProduct[]
  ) => {
    setSpecifications(newSpecifications);
  };

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);

    if (fields.length > 0) {
      router.push(`#${fields[0]}`);
    }
    return fields;
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

    setLoading(true);

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

      const payload = await axiosPost("/products", {
        title: product.title,
        description: product.description,
        shortDescription: product.shortDescription,
        meta_title: product.title,
        meta_description: product.description,
        thumbnail,
        gallery,
        category: defaultCategory,
        categories: categoriesProduct,
        breadcrumbs,
        specifications,
        price: product.price,
        promotion_price: product.promotion_price,
        inventory: product.inventory,
        public: product.public,
      });

      if (payload.status === 201) {
        toast.success("Success create product", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/products");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error in create product", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    let data: IObjectCategory = {};
    try {
      const response = await axiosGet("categories");

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
      const response = await axiosGet("categories/parent");
      const data = response.payload.map((item: any) => item._id);

      setCategoriesParent(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetCategories();
    handleGetCategoriesParent();
  }, []);

  return (
    <FormLayout
      title="Create Product"
      backLink="/products"
      onSubmit={handleOnSubmit}
    >
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Title"
            width="lg:w-2/4 w-full"
            value={product.title}
            error={fieldsCheck.includes("title")}
            name="title"
            placeholder="Input product name..."
            type={typeInput.input}
            getValue={changeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Short description"
            width="lg:w-2/4 w-full"
            error={fieldsCheck.includes("shortDescription")}
            value={product.shortDescription}
            name="shortDescription"
            placeholder="Input short description about product"
            type={typeInput.textarea}
            rows={2}
            getValue={changeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Description"
            width="lg:w-2/4 w-full"
            error={fieldsCheck.includes("description")}
            value={product.description}
            name="description"
            placeholder="Input description about product"
            type={typeInput.textarea}
            getValue={changeValue}
          />
        </div>

        <div className="w-full mt-5">
          <MultipleValue
            title="Categories"
            width="lg:w-2/4 w-full"
            items={mutipleCategories}
            name="categories"
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
        </div>

        <div className="w-full flex flex-col mt-5 lg:gap-5 gap-3">
          <SelectItem
            width="lg:w-2/4 w-full"
            title="Default category"
            name="category"
            value={defaultCategory ? defaultCategory : ""}
            onSelect={onSelectDefaultCategory}
            data={mutipleCategories}
          />
        </div>

        <div className="w-full flex flex-col mt-5 lg:gap-5 gap-3">
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

        <div className="w-full flex flex-col mt-5 lg:gap-5 gap-3">
          <Input
            title="Price"
            width="lg:w-2/4 w-full"
            error={fieldsCheck.includes("price")}
            value={formatBigNumber(product.price)}
            name="price"
            type={typeInput.price}
            getNumber={changePrice}
          />

          <Input
            title="Promotion Price"
            width="lg:w-2/4 w-full"
            value={formatBigNumber(product.promotion_price)}
            error={fieldsCheck.includes("promotion_price")}
            name="promotion_price"
            type={typeInput.price}
            getNumber={changePrice}
          />

          <Input
            title="Inventory"
            width="lg:w-2/4 w-full"
            value={product.inventory.toString()}
            error={fieldsCheck.includes("inventory")}
            name="inventory"
            type={typeInput.number}
            getNumber={changePrice}
          />
        </div>

        <div className="lg:w-2/4 w-full flex flex-col mt-5 lg:gap-5 gap-3">
          <Specifications
            specifications={specifications}
            onUpdate={onUpdateSpecifications}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <ButtonCheck
            title="Public"
            name="public"
            width="w-fit"
            isChecked={product.public}
            onChange={changePublic}
          />
        </div>

        {loading && <Loading />}
      </div>
    </FormLayout>
  );
};

export default CreateProductPage;

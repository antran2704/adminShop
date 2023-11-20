import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { axiosGet, axiosPost } from "~/ultils/configAxios";

import {
  IThumbnailUrl,
  ICategorySelect,
  IObjectCategory,
  ICreateProduct,
  ISelectItem,
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

const initData: ICreateProduct = {
  title: "",
  description: "",
  shortDescription: "",
  category: { _id: null, title: "" },
  categories: [],
  price: 0,
  promotionPrice: 0,
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

  const [thumbnailUrl, setThumbnailUrl] = useState<IThumbnailUrl>({
    source: {},
    url: "",
  });

  const [gallery, setGallery] = useState<string[]>([]);

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

    const newItem: ISelectItem = { id: node_id, title: title as string };

    setCategorySelect({ title, node_id });
    setMultipleCategories([...mutipleCategories, newItem]);
  };

  const changeMultipleCategories = (name: string, values: ISelectItem[]) => {
    if (fieldsCheck.includes(name)) {
      const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
      setFieldsCheck(newFieldsCheck);
    }
    setMultipleCategories(values);
  };

  const onSelectDefaultCategory = (value: string) => {
    setDefaultCategory(value);
  };

  const changeValue = (name: string, value: string) => {
    if (fieldsCheck.includes(name)) {
      const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
      setFieldsCheck(newFieldsCheck);
    }
    setProduct({ ...product, [name]: value });
  };

  const changePublic = (name: string, value: boolean) => {
    setProduct({ ...product, [name]: value });
  };

  const uploadThumbnail = (source: object, url: string) => {
    if (source && url) {
      if (fieldsCheck.includes("thumbnail")) {
        removeFieldCheck("thumbnail");
      }

      setThumbnailUrl({ source, url });
      setProduct({ ...product, thumbnail: url });
    }
  };

  const onUploadGallery = async (source: File) => {
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
  };

  const onRemoveGallary = async (url: string) => {
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
  };

  const generalBreadcrumbs = (
    node_id: string | null,
    breadcrumbs: string[]
  ) => {
    if (!node_id) return;

    const item = categories[node_id];

    generalBreadcrumbs(item.parent_id, breadcrumbs);
    breadcrumbs.push(item._id as string);
    return breadcrumbs;
  };

  const removeFieldCheck = (name: string) => {
    const newFieldsCheck = fieldsCheck.filter(
      (field: string) => field !== name
    );
    setFieldsCheck(newFieldsCheck);
  };

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);
    router.push(`#${fields[0]}`);
    return fields;
  };

  const handleOnSubmit = async () => {
    const formData: FormData = new FormData();
    const source: any = thumbnailUrl.source;
    formData.append("thumbnail", source);
    let breadcrumbs: string[] = [];
    const fields = checkData([
      {
        name: "title",
        value: product.title,
      },
      {
        name: "description",
        value: product.description,
      },
      {
        name: "thumbnail",
        value: thumbnailUrl.url,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    try {
      const imagePayload = await uploadImageOnServer(
        `${process.env.NEXT_PUBLIC_ENDPOINT_API}/products/uploadThumbnail`,
        formData
      );

      if (imagePayload.status !== 201) {
        return toast.error("Error in upload thumbail for product", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      // if (categorySelect.node_id) {
      //   breadcrumbs = generalBreadcrumbs(
      //     categorySelect.node_id,
      //     []
      //   ) as string[];
      // }

      const payload = await axiosPost("/categories", {
        title: product.title,
        description: product.description,
        meta_title: product.title,
        meta_description: product.description,
        // parent_id: categorySelect.node_id,
        thumbnail: imagePayload.payload,
        public: product.public,
        breadcrumbs,
      });

      if (payload.status === 201) {
        toast.success("Success create category", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/categories");
      }
    } catch (error) {
      toast.error("Error in create category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
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
    <FormLayout title="Create Product" backLink="/products" onSubmit={() => {}}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
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
            error={fieldsCheck.includes("short_description")}
            value={product.description}
            name="short_description"
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
            thumbnailUrl={thumbnailUrl.url}
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
            value={"0"}
            name="price"
            placeholder="Price"
            type={typeInput.number}
            getValue={changeValue}
          />

          <Input
            title="Promotion Price"
            width="lg:w-2/4 w-full"
            error={fieldsCheck.includes("price")}
            value={"0"}
            name="price"
            placeholder="Price"
            type={typeInput.number}
            getValue={changeValue}
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
      </div>
    </FormLayout>
  );
};

export default CreateProductPage;

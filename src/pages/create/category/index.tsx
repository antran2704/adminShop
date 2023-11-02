import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { axiosGet, axiosPost } from "~/ultils/configAxios";

import {
  IThumbnailUrl,
  IDataCategory,
  ICategorySelect,
  IObjectCategory,
  IBreadcrumb,
} from "~/interface/category";
import { typeInput } from "~/enums";
import { uploadImageOnServer } from "~/helper/handleImage";
import FormLayout from "~/layouts/FormLayout";
import Input from "~/components/Input";
import Tree from "~/components/Tree";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";

const initData: IDataCategory = {
  parent_id: null,
  title: "",
  description: "",
  meta_title: "",
  meta_description: "",
  public: true,
  slug: null,
  thumbnail: null,
  breadcrumbs: [],
  childrens: [],
};

const AddCategoryPage = () => {
  const router = useRouter();

  const [data, setData] = useState<IDataCategory>(initData);
  const [categories, setCategories] = useState<IObjectCategory>({});
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);
  const [categoriesParent, setCategoriesParent] = useState([]);
  const [categorySelect, setCategorySelect] = useState<ICategorySelect>({
    title: null,
    node_id: null,
  });

  console.log(fieldsCheck);

  const [thumbnailUrl, setThumbnailUrl] = useState<IThumbnailUrl>({
    source: {},
    url: "",
  });

  const onSelectCategory = (title: string | null, node_id: string | null) => {
    setCategorySelect({ title, node_id });
  };

  const changeValue = (name: string, value: string) => {
    if (fieldsCheck.includes(name)) {
      removeFieldCheck(name);
    }
    setData({ ...data, [name]: value });
  };

  const changePublic = (name: string, value: boolean) => {
    setData({ ...data, [name]: value });
  };

  const uploadThumbnail = (source: object, url: string) => {
    if (source && url) {
      if (fieldsCheck.includes("thumbnail")) {
        removeFieldCheck("thumbnail");
      }

      setThumbnailUrl({ source, url });
      setData({ ...data, thumbnail: url });
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
    let fields = [];

    for (const item of data) {
      if (item.value.length === 0 || !item.value) {
        fields.push(item.name);
      }
    }

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
        value: data.title,
      },
      {
        name: "description",
        value: data.description,
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
        `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/uploadThumbnail`,
        formData
      );

      if (imagePayload.status !== 201) {
        return toast.error("Error in upload thumbail for category", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      if (categorySelect.node_id) {
        breadcrumbs = generalBreadcrumbs(
          categorySelect.node_id,
          []
        ) as string[];
      }

      const payload = await axiosPost("/category", {
        title: data.title,
        description: data.description,
        meta_title: data.title,
        meta_description: data.description,
        parent_id: categorySelect.node_id,
        thumbnail: imagePayload.payload,
        public: data.public,
        breadcrumbs,
      });

      if (payload.status === 201) {
        toast.success("Success add category", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.back();
      }
    } catch (error) {
      toast.error("Error in add category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  const handleGetCategories = async () => {
    let data: IObjectCategory = {};
    try {
      const response = await axiosGet("category/getCategories");

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
      const response = await axiosGet("category/parentCategories");
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
    <FormLayout onSubmit={handleOnSubmit}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
          <Input
            title="Title"
            width="lg:w-2/4 w-full"
            value={data.title}
            error={fieldsCheck.includes("title")}
            name="title"
            type={typeInput.input}
            getValue={changeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Description"
            width="lg:w-2/4 w-full"
            error={fieldsCheck.includes("description")}
            value={data.description}
            name="description"
            type={typeInput.textarea}
            getValue={changeValue}
          />
        </div>

        <div className="w-full mt-5">
          <Input
            title="Parent Category"
            width="lg:w-2/4 w-full"
            value={categorySelect.title ? categorySelect.title : ""}
            name="parent_id"
            type={typeInput.input}
            readonly={true}
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

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            error={fieldsCheck.includes("thumbnail")}
            thumbnailUrl={thumbnailUrl.url}
            onChange={uploadThumbnail}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <ButtonCheck
            title="Public"
            name="public"
            width="w-fit"
            isChecked={data.public}
            onChange={changePublic}
          />
        </div>
      </div>
    </FormLayout>
  );
};

export default AddCategoryPage;

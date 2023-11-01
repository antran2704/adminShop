import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { axiosGet, axiosPost } from "~/ultils/configAxios";

import {
  IThumbnailUrl,
  IDataCategory,
  ICategorySelect,
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
  const [categories, setCategories] = useState({});
  const [categoriesParent, setCategoriesParent] = useState([]);
  const [categorySelect, setCategorySelect] = useState<ICategorySelect>({
    title: null,
    node_id: null,
  });

  const onSelectCategory = (title: string | null, node_id: string | null) => {
    setCategorySelect({ title, node_id });
  };

  const changeValue = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  const changePublic = (name: string, value: boolean) => {
    setData({ ...data, [name]: value });
  };

  const [thumbnailUrl, setThumbnailUrl] = useState<IThumbnailUrl>({
    source: {},
    url: "",
  });

  const uploadThumbnail = (source: object, url: string) => {
    if (source && url) {
      setThumbnailUrl({ source, url });
      setData({ ...data, thumbnail: url });
    }
  };

  const handleOnSubmit = async () => {
    const formData: FormData = new FormData();
    const source: any = thumbnailUrl.source;
    formData.append("thumbnail", source);

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

      const payload = await axiosPost("/category", {
        title: data.title,
        description: data.description,
        parent_id: categorySelect.node_id,
        thumbnail: imagePayload.payload,
        public: data.public,
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
    let data: any = {};
    try {
      const response = await axiosGet("category/getCategories");

      for (const item of response.payload) {
        const { _id, parent_id, title, childrens } = item;
        data[_id] = { _id, parent_id, title, childrens };
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
            name="title"
            type={typeInput.input}
            getValue={changeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Description"
            width="lg:w-2/4 w-full"
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

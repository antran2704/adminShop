import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { axiosGet, axiosPatch } from "~/ultils/configAxios";

import {
  IThumbnailUrl,
  IDataCategory,
  ICategorySelect,
} from "~/interface/category";
import { typeInput } from "~/enums";
import { deleteImageInSever, uploadImageOnServer } from "~/helper/handleImage";
import FormLayout from "~/layouts/FormLayout";
import Input from "~/components/Input";
import Tree from "~/components/Tree";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";

const initData: IDataCategory = {
  _id: null,
  parent_id: null,
  title: "",
  description: "",
  public: true,
  thumbnail: null,
};

interface Props {
  query: any;
}

const EditCategoryPage = (props: Props) => {
  const router = useRouter();
  const { query } = props;

  const [data, setData] = useState<IDataCategory>(initData);
  const [categories, setCategories] = useState({});
  const [categoriesParent, setCategoriesParent] = useState([]);
  const [categorySelect, setCategorySelect] = useState<ICategorySelect>({
    title: null,
    node_id: null,
  });

  const [thumbnailUrl, setThumbnailUrl] = useState<IThumbnailUrl>({
    source: {},
    url: "",
  });

  const [loading, setLoading] = useState(true);

  const onSelectCategory = (title: string | null, node_id: string | null) => {
    setCategorySelect({ title, node_id });
  };

  const changeValue = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  const changePublic = (name: string, value: boolean) => {
    setData({ ...data, [name]: value });
  };

  const uploadThumbnail = (source: object, url: string) => {
    if (source && url) {
      setThumbnailUrl({ source, url });
    }
  };

  const handleOnSubmit = async () => {
    let payload;
    let sendData = {
      title: data.title,
      description: data.description,
      meta_title: data.title,
      meta_description: data.description,
      thumbnail: data.thumbnail,
      public: data.public,
      parent_id: categorySelect.node_id,
    };

    setLoading(true);

    try {
      if (data.thumbnail !== thumbnailUrl.url) {
        const deleteImagePayload = await deleteImageInSever(
          data.thumbnail as string
        );

        if (deleteImagePayload.status !== 201) {
          toast.error("Error in updated thumbnail", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }

        const formData = new FormData();
        const source: Blob = thumbnailUrl.source as Blob;
        formData.append("thumbnail", source);

        const uploadImage = await uploadImageOnServer(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/categories/uploadThumbnail`,
          formData
        );

        payload = await axiosPatch(`/categories/${data._id}`, {
          ...sendData,
          thumbnail: uploadImage.payload,
        });
      } else {
        payload = await axiosPatch(`/categories/${data._id}`, { ...sendData });
      }

      if (payload.status === 201) {
        toast.success("Success updated category", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.back();
      }
    } catch (error) {
      toast.error("Error in add category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const handleGetData = async () => {
    const id = query.id;
    try {
      const data = await axiosGet(`/categories/id/${id}`);

      if (data.status === 200) {
        const title = data.payload.parent_id
          ? data.payload.parent_id.title
          : "Home";
        const node_id = data.payload.parent_id
          ? data.payload.parent_id._id
          : null;

        setData({
          _id: data.payload._id,
          parent_id: data.payload.parent_id,
          title: data.payload.title,
          description: data.payload.description,
          thumbnail: data.payload.thumbnail,
          public: data.payload.public,
        });

        setThumbnailUrl({ ...thumbnailUrl, url: data.payload.thumbnail });
        setCategorySelect({
          node_id,
          title,
        });

        setLoading(false);
      }
    } catch (error) {
      toast.error("Error server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    let data: any = {};
    try {
      const response = await axiosGet("/categories");

      for (const item of response.payload) {
        const { _id, parent_id, title, childrens } = item;
        data[_id] = { _id, parent_id, title, childrens };
      }

      setCategories(data);
    } catch (error) {
      toast.error("Error server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const handleGetCategoriesParent = async () => {
    try {
      const response = await axiosGet("/categories/parent");
      const data = response.payload.map((item: any) => item._id);

      setCategoriesParent(data);
    } catch (error) {
      toast.error("Error server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      handleGetData(),
      handleGetCategories(),
      handleGetCategoriesParent(),
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <FormLayout onSubmit={handleOnSubmit}>
      <Fragment>
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
            {data?._id && (
              <ButtonCheck
                title="Public"
                name="public"
                width="w-fit"
                isChecked={data.public}
                onChange={changePublic}
              />
            )}
          </div>
        </div>

        {loading && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black opacity-60 z-50">
            <AiOutlineLoading3Quarters className="spinner text-5xl text-white" />
          </div>
        )}
      </Fragment>
    </FormLayout>
  );
};

export default EditCategoryPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

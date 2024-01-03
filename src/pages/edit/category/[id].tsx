import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment, useCallback } from "react";
import { toast } from "react-toastify";

import { axiosGet, axiosPatch } from "~/ultils/configAxios";
import generalBreadcrumbs from "~/helper/generateBreadcrumb";
import { deleteImageInSever, uploadImageOnServer } from "~/helper/handleImage";

import {
  IDataCategory,
  ICategorySelect,
  IObjectCategory,
} from "~/interface/category";
import FormLayout from "~/layouts/FormLayout";
import { InputText } from "~/components/InputField";
import Tree from "~/components/Tree";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import Loading from "~/components/Loading";

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
  const [title, setTitle] = useState<string | null>(null);
  const [data, setData] = useState<IDataCategory>(initData);
  const [categories, setCategories] = useState<IObjectCategory>({});
  const [categoriesParent, setCategoriesParent] = useState([]);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);
  const [categorySelect, setCategorySelect] = useState<ICategorySelect>({
    title: null,
    node_id: null,
  });

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);

  const onSelectCategory = (title: string | null, node_id: string | null) => {
    setCategorySelect({ title, node_id });
  };

  const changeValue = (name: string, value: string) => {
    if (fieldsCheck.includes(name)) {
      const newFieldsCheck = handleRemoveCheck(fieldsCheck, name);
      setFieldsCheck(newFieldsCheck);
    }

    setData({ ...data, [name]: value });
  };

  const changePublic = (name: string, value: boolean) => {
    setData({ ...data, [name]: value });
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
        formData.append("thumbnail", source);
        setLoadingThumbnail(true);

        try {
          const { status, payload } = await uploadImageOnServer(
            `${process.env.NEXT_PUBLIC_ENDPOINT_API}/categories/uploadThumbnail`,
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
    [thumbnail]
  );

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);
    router.push(`#${fields[0]}`);
    return fields;
  };

  const handleOnSubmit = async () => {
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
        value: thumbnail,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    let breadcrumbs: string[] = generalBreadcrumbs(
      categorySelect.node_id || null,
      categories
    );
    let sendData = {
      title: data.title,
      description: data.description,
      meta_title: data.title,
      meta_description: data.description,
      thumbnail,
      public: data.public,
      parent_id: categorySelect.node_id,
      breadcrumbs,
    };

    setLoading(true);

    try {
      if (data.thumbnail !== thumbnail) {
        const deleteImagePayload = await deleteImageInSever(
          data.thumbnail as string
        );

        if (deleteImagePayload.status !== 201) {
          toast.error("Error in updated thumbnail", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }

      const payload = await axiosPatch(`/categories/${data._id}`, {
        ...sendData,
      });

      if (payload.status === 201) {
        toast.success("Success updated category", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false);
        router.push("/categories");
      }
    } catch (error) {
      toast.error("Error in add category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const handleGetData = async () => {
    setLoading(true);
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
        setTitle(data.payload.title);
        setThumbnail(data.payload.thumbnail);
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
    <FormLayout
      title={`Edit category ${title ? title : ""}`}
      backLink="/categories"
      onSubmit={handleOnSubmit}
    >
      <Fragment>
        <div>
          <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
            <InputText
              title="Title"
              error={fieldsCheck.includes("title")}
              width="lg:w-2/4 w-full"
              value={data.title}
              name="title"
              getValue={changeValue}
            />
          </div>

          <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
            <InputText
              title="Description"
              width="lg:w-2/4 w-full"
              value={data.description}
              name="description"
              error={fieldsCheck.includes("description")}
              getValue={changeValue}
            />
          </div>

          <div className="w-full mt-5">
            <InputText
              title="Parent Category"
              width="lg:w-2/4 w-full"
              value={categorySelect.title ? categorySelect.title : ""}
              name="parent_id"
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
              url={thumbnail}
              loading={loadingThumbnail}
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

        {loading && <Loading />}
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

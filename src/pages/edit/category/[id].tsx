import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  useState,
  useEffect,
  Fragment,
  useCallback,
  ReactElement,
} from "react";
import { toast } from "react-toastify";

import generalBreadcrumbs from "~/helper/generateBreadcrumb";
import { deleteImageInSever } from "~/helper/handleImage";

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
import {
  deleteCategory,
  getCategories,
  getCategory,
  getParentCategories,
  updateCategory,
  uploadThumbnailCategory,
} from "~/api-client";
import Popup from "~/components/Popup";
import { generateSlug } from "~/helper/generateSlug";
import { ECompressFormat, ETypeImage } from "~/enums";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { NextPageWithLayout } from "~/interface/page";

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

const Layout = LayoutWithHeader;

const EditCategoryPage: NextPageWithLayout<Props> = (props: Props) => {
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

  const [defaultSelect, setDefaultSelect] = useState<ICategorySelect>({
    title: null,
    node_id: null,
  });

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

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
          const { status, payload } = await uploadThumbnailCategory(formData);

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

  const handleDeleteCategory = useCallback(async () => {
    if (!data._id) return;

    try {
      if (data.thumbnail) {
        await deleteImageInSever(data.thumbnail as string);
      }

      await deleteCategory(data._id as string);
      setShowPopup(false);

      toast.success("Success delete category", {
        position: toast.POSITION.TOP_RIGHT,
      });

      router.push("/categories");
    } catch (error) {
      toast.error("Error delete category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  }, [data]);

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
      slug: generateSlug(data.title),
    };

    setLoading(true);

    try {
      // if (data.thumbnail !== thumbnail) {
      //   const deleteImagePayload = await deleteImageInSever(
      //     data.thumbnail as string
      //   );

      //   if (deleteImagePayload.status !== 201) {
      //     toast.error("Error in updated thumbnail", {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   }
      // }

      const payload = await updateCategory(data._id as string, sendData);

      if (payload.status === 201) {
        toast.success("Success updated category", {
          position: toast.POSITION.BOTTOM_RIGHT,
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
      const data = await getCategory(id);
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
        setDefaultSelect({
          node_id: data.payload._id,
          title: data.payload.title,
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
      const response = await getCategories();

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
      const response = await getParentCategories();
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
        <div className="lg:w-2/4 w-full mx-auto">
          <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
            <InputText
              title="Title"
              error={fieldsCheck.includes("title")}
              width="w-full"
              value={data.title}
              name="title"
              getValue={changeValue}
            />

            <InputText
              title="Description"
              width="w-full"
              value={data.description}
              name="description"
              error={fieldsCheck.includes("description")}
              getValue={changeValue}
            />
          </div>

          <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
            <InputText
              title="Parent Category"
              width="w-full"
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
                    defaultSelect={defaultSelect}
                    onSelect={onSelectCategory}
                  />
                )}
            </div>
          </div>

          <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
            <Thumbnail
              error={fieldsCheck.includes("thumbnail")}
              url={thumbnail}
              loading={loadingThumbnail}
              onChange={uploadThumbnail}
              option={{
                quality: 90,
                maxHeight: 200,
                maxWidth: 200,
                minHeight: 200,
                minWidth: 200,
                compressFormat: ECompressFormat.WEBP,
                type: ETypeImage.file,
              }}
            />
          </div>

          <div className="w-full flex lg:flex-nowrap flex-wrap items-end justify-between mt-5 gap-5">
            {data?._id && (
              <ButtonCheck
                title="Public"
                name="public"
                width="w-fit"
                isChecked={data.public}
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
        </div>

        {loading && <Loading />}

        {showPopup && (
          <Popup
            title="Xác nhận xóa thư mục"
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
                  onClick={handleDeleteCategory}
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

export default EditCategoryPage;

EditCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

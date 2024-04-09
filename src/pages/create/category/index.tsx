import { useRouter } from "next/router";
import { useState, useEffect, ReactElement } from "react";
import { toast } from "react-toastify";

import { IDataCategory, ICategorySelect, IObjectCategory } from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import { InputText } from "~/components/InputField";
import Tree from "~/components/Tree";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import generalBreadcrumbs from "~/helper/generateBreadcrumb";
import Loading from "~/components/Loading";
import {
  createCategory,
  getAllCategories,
  getParentCategories,
  uploadThumbnailCategory,
} from "~/api-client";
import { ECompressFormat, ETypeImage } from "~/enums";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";

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

const Layout = LayoutWithHeader;

const CreateCategoryPage = () => {
  const router = useRouter();

  const [data, setData] = useState<IDataCategory>(initData);
  const [categories, setCategories] = useState<IObjectCategory>({});
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);
  const [categoriesParent, setCategoriesParent] = useState([]);
  const [categorySelect, setCategorySelect] = useState<ICategorySelect>({
    title: null,
    node_id: null,
  });

  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

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

  const uploadThumbnail = async (source: File) => {
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

    setLoading(true);

    try {
      let breadcrumbs: string[] = generalBreadcrumbs(
        categorySelect.node_id || null,
        categories
      );

      const payload = await createCategory({
        title: data.title,
        description: data.description,
        meta_title: data.title,
        meta_description: data.description,
        parent_id: categorySelect.node_id,
        thumbnail,
        public: data.public,
        breadcrumbs,
      });

      if (payload.status === 201) {
        toast.success("Success create category", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/categories");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error in create category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const handleGetCategories = async () => {
    let data: IObjectCategory = {};
    try {
      const response = await getAllCategories();

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

  useEffect(() => {
    handleGetCategories();
    handleGetCategoriesParent();
  }, []);

  return (
    <FormLayout
      title="Create category"
      backLink="/categories"
      onSubmit={handleOnSubmit}
    >
      <div className="lg:w-2/4 w-full mx-auto">
        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <InputText
            title="Title"
            width="w-full"
            value={data.title}
            error={fieldsCheck.includes("title")}
            name="title"
            placeholder="Title for category..."
            getValue={changeValue}
          />

          <InputText
            title="Description"
            width="w-full"
            error={fieldsCheck.includes("description")}
            value={data.description}
            name="description"
            placeholder="Description for category..."
            getValue={changeValue}
          />
        </div>

        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <InputText
            title="Parent Category"
            width="w-full"
            value={categorySelect.title ? categorySelect.title : ""}
            name="parent_id"
            placeholder="Please select parent category"
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

          <ButtonCheck
            title="Public"
            name="public"
            width="w-fit"
            isChecked={data.public}
            onChange={changePublic}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3"></div>

        {loading && <Loading />}
      </div>
    </FormLayout>
  );
};

export default CreateCategoryPage;

CreateCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
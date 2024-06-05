import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ICreateBlog, ISelectItem, ITagBlog, TagBlogUpdate } from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import { InputText, InputTextarea } from "~/components/InputField";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import Loading from "~/components/Loading";
import { createBlog, getTagBlogs, uploadBlogImage } from "~/api-client";
import { ECompressFormat, ETypeImage } from "~/enums";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { NextPageWithLayout } from "~/interface/page";
import { useTranslation } from "react-i18next";
import SelectMultipleItem from "~/components/Select/SelectMultipleItem";
import { useAppSelector } from "~/store/hooks";

const CustomEditor = dynamic(
  () => {
    return import("~/components/Editor");
  },
  { ssr: false }
);

const initData: ICreateBlog = {
  author: "",
  title: "",
  content: "",
  description: "",
  thumbnail: "",
  public: true,
  tags: [],
};

const Layout = LayoutWithHeader;

const CreateCategoryPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state);

  const [data, setData] = useState<ICreateBlog>(initData);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);

  const [listTags, setListTags] = useState<ITagBlog[]>([]);
  const [tags, setTags] = useState<ISelectItem[]>([]);
  const [selectTag, setSelectTag] = useState<ISelectItem[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [content, setContend] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

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
      if (fieldsCheck.includes("image")) {
        const newFieldsCheck = handleRemoveCheck(fieldsCheck, "image");
        setFieldsCheck(newFieldsCheck);
        ("image");
      }

      const formData: FormData = new FormData();
      formData.append("image", source);
      setLoadingThumbnail(true);

      try {
        const { status, payload } = await uploadBlogImage(formData);

        if (status === 201) {
          setImage(payload);
          setLoadingThumbnail(false);
        }
      } catch (error) {
        toast.error("Upload image failed", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoadingThumbnail(false);
        console.log(error);
      }
    }
  };

  const changeSelectTag = (select: ISelectItem[]) => {
    console.log(select);
    setSelectTag(select);
  };

  const handleChangeContent = (newContent: string) => {
    if (!newContent) return;
    console.log(newContent);
    setContend(newContent);
  };

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);
    if (fields.length > 0) {
      router.push(`#${fields[0]}`);
    }
    return fields;
  };

  const handleGetTags = async () => {
    try {
      const { status, payload } = await getTagBlogs(1);

      if (status === 200) {
        const tagsBlog: ISelectItem[] = payload.map((item: ITagBlog) => ({
          _id: item._id,
          title: item.title,
        }));

        setListTags(payload);
        setTags(tagsBlog);
      }
    } catch (error) {
      console.log(error);
    }
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
        value: image,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    if (!user.infor._id) return;

    setLoading(true);

    const listTagSend = selectTag.map((tag: ISelectItem) => {
      const item = listTags.find((item: ITagBlog) => item._id === tag._id);

      if (item) {
        return {
          tag: item._id,
          slug: item.slug,
        };
      }
    });

    const sendData: ICreateBlog = {
      author: user.infor._id,
      title: data.title,
      description: data.description,
      meta_title: data.title,
      meta_description: data.description,
      thumbnail: image as string,
      content,
      tags: listTagSend as TagBlogUpdate[],
      public: data.public,
    };

    try {
      const payload = await createBlog(sendData);

      if (payload.status === 201) {
        toast.success("Success create blog", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/blogs");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error in create category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTags();
  }, []);

  return (
    <FormLayout
      title={t("CreateBannerPage.title")}
      backLink="/banners"
      onSubmit={handleOnSubmit}
    >
      <div className="lg:w-2/4 w-full mx-auto">
        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <InputText
            title={t("CreateBannerPage.field.title")}
            width="w-full"
            value={data.title}
            error={fieldsCheck.includes("title")}
            name="title"
            placeholder="Title blog..."
            getValue={changeValue}
          />

          <InputTextarea
            title="Description"
            width="w-full"
            value={data.description}
            error={fieldsCheck.includes("description")}
            name="description"
            placeholder="Description blog.."
            getValue={changeValue}
          />

          <SelectMultipleItem
            title={"Tags"}
            width="w-full"
            select={selectTag}
            data={tags}
            name="tags"
            placeholder="Please select tag..."
            error={fieldsCheck.includes("tags")}
            getSelect={changeSelectTag}
          />
        </div>
        <div className="w-full py-5">
          <CustomEditor content={content} getContent={handleChangeContent} />
        </div>
        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <Thumbnail
            error={fieldsCheck.includes("thumbnail")}
            url={image}
            loading={loadingThumbnail}
            onChange={uploadThumbnail}
            option={{
              quality: 80,
              maxHeight: 600,
              maxWidth: 600,
              minHeight: 400,
              minWidth: 400,
              compressFormat: ECompressFormat.WEBP,
              type: ETypeImage.file,
            }}
          />

          <ButtonCheck
            title={t("CreateBannerPage.field.public")}
            name="isPublic"
            width="w-fit"
            isChecked={data.public}
            onChange={changePublic}
          />
        </div>
        {loading && <Loading />}
      </div>
    </FormLayout>
  );
};

export default CreateCategoryPage;

CreateCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

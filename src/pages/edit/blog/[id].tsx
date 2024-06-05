import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  IBlog,
  ICreateBlog,
  IResponseSuccess,
  ISelectItem,
  ITagBlog,
  TagBlog,
  TagBlogUpdate,
} from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import { InputText, InputTextarea } from "~/components/InputField";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import Loading from "~/components/Loading";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getTagBlogs,
  updateBlog,
  uploadBlogImage,
} from "~/api-client";
import { ECompressFormat, ETypeImage } from "~/enums";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { NextPageWithLayout } from "~/interface/page";
import { useTranslation } from "react-i18next";
import SelectMultipleItem from "~/components/Select/SelectMultipleItem";
import { useAppSelector } from "~/store/hooks";
import Popup from "~/components/Popup";

const CustomEditor = dynamic(
  () => {
    return import("~/components/Editor");
  },
  { ssr: false }
);

const initData: IBlog = {
  _id: "",
  author: null,
  title: "",
  content: "",
  description: "",
  thumbnail: "",
  public: true,
  tags: [],
  slug: "",
};

const Layout = LayoutWithHeader;

const EditBlogPage: NextPageWithLayout = () => {
  const router = useRouter();
  const blogIdParam: string = router.query.id as string;

  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user);

  const [data, setData] = useState<IBlog>(initData);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);

  const [listTags, setListTags] = useState<ITagBlog[]>([]);
  const [tags, setTags] = useState<ISelectItem[]>([]);
  const [selectTag, setSelectTag] = useState<ISelectItem[]>([]);

  const [image, setImage] = useState<string | null>(null);
  const [content, setContend] = useState<string>("");

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

  const handlePopup = () => {
    setShowPopup(!showPopup);
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
    setSelectTag(select);
  };

  const handleChangeContent = (newContent: string) => {
    if (!newContent) return;
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

  const handleDeleteBlog = async () => {
    if (!blogIdParam) {
      setShowPopup(false);
      toast.error("False delete blog", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setLoading(true);

    try {
      await deleteBlog(blogIdParam);
      setShowPopup(false);

      toast.success("Success delete blog", {
        position: toast.POSITION.TOP_RIGHT,
      });

      router.push("/blogs");
    } catch (error) {
      toast.error("Error delete blog", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
      console.log(error);
    }
  };

  const handleGetData = async (blogId: string) => {
    if (!blogId) return;
    setLoading(true);

    try {
      const { status, payload }: IResponseSuccess<IBlog> = await getBlog(
        blogId
      );

      if (status === 200) {
        const tags: ISelectItem[] = payload.tags.map((item: TagBlog) => ({
          _id: item.tag._id,
          title: item.tag.title,
        }));

        setData(payload);
        setContend(payload.content);
        setImage(payload.thumbnail);
        setSelectTag(tags);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error get data", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoading(false);
  };

  const handleGetTags = async () => {
    try {
      const { status, payload } = await getTagBlogs(1);

      if (status === 200) {
        const tagsBlog: ISelectItem[] = payload.map((item: ITagBlog) => ({
          _id: item._id,
          title: item.title,
        }));

        setTags(tagsBlog);
        setListTags(payload);
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

    if (!user.infor._id || !blogIdParam) return;

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
      const payload = await updateBlog(blogIdParam, sendData);

      if (payload.status === 201) {
        toast.success("Success update blog", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/blogs");
      }
    } catch (error) {
      toast.error("Error in update blog", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTags();
  }, []);

  useEffect(() => {
    if (blogIdParam) {
      handleGetData(blogIdParam);
    }
  }, [blogIdParam]);

  return (
    <FormLayout
      title={t("CreateBannerPage.title")}
      backLink="/blogs"
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
          {data._id && (
            <CustomEditor content={content} getContent={handleChangeContent} />
          )}
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
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-end justify-between mt-5 gap-5">
          {data?._id && (
            <ButtonCheck
              title={t("CreateBannerPage.field.public")}
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
            {t("Action.delete")}
          </button>
        </div>
        {loading && <Loading />}

        {showPopup && (
          <Popup
            title="Xác nhận xóa Blog"
            show={showPopup}
            img="/popup/trash.svg"
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
                  onClick={handleDeleteBlog}
                  className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 opacity-90 hover:opacity-100 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </Popup>
        )}
      </div>
    </FormLayout>
  );
};

export default EditBlogPage;

EditBlogPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

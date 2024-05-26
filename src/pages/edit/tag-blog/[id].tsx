import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { IResponseSuccess, ISelectItem, ITagBlog } from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import { InputText } from "~/components/InputField";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import Loading from "~/components/Loading";
import {
  deleteBlog,
  getTagBlog,
  updateTagBlog,
  uploadBlogImage,
} from "~/api-client";
import { ECompressFormat, ETypeImage } from "~/enums";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { NextPageWithLayout } from "~/interface/page";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "~/store/hooks";
import Popup from "~/components/Popup";

const initData: ITagBlog = {
  _id: "",
  title: "",
  thumbnail: "",
  public: true,
  slug: "",
};

const Layout = LayoutWithHeader;

const EditBlogPage: NextPageWithLayout = () => {
  const router = useRouter();
  const tagIdParam: string = router.query.id as string;

  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user);

  const [data, setData] = useState<ITagBlog>(initData);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);

  const [image, setImage] = useState<string | null>(null);

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

  const checkData = (data: any) => {
    let fields = handleCheckFields(data);
    setFieldsCheck(fields);
    if (fields.length > 0) {
      router.push(`#${fields[0]}`);
    }
    return fields;
  };

  const handleDeleteBlog = async () => {
    if (!tagIdParam) {
      setShowPopup(false);
      toast.error("False delete blog", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setLoading(true);

    try {
      await deleteBlog(tagIdParam);
      setShowPopup(false);

      toast.success("Success delete blog", {
        position: toast.POSITION.TOP_RIGHT,
      });

      router.push("/tag-blogs");
    } catch (error) {
      toast.error("Error delete blog", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
      console.log(error);
    }
  };

  const handleGetData = async (tagId: string) => {
    if (!tagId) return;
    setLoading(true);

    try {
      const { status, payload }: IResponseSuccess<ITagBlog> = await getTagBlog(
        tagId
      );

      if (status === 200) {
        setData(payload);
        setImage(payload.thumbnail);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error get data", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoading(false);
  };

  const handleOnSubmit = async () => {
    const fields = checkData([
      {
        name: "title",
        value: data.title,
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

    if (!user.infor._id || !tagIdParam) return;

    setLoading(true);

    try {
      const payload = await updateTagBlog(tagIdParam, data);

      if (payload.status === 201) {
        toast.success("Success update blog", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/tag-blogs");
      }
    } catch (error) {
      toast.error("Error in update blog", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tagIdParam) {
      handleGetData(tagIdParam);
    }
  }, [tagIdParam]);

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
        </div>
        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <Thumbnail
            error={fieldsCheck.includes("thumbnail")}
            url={image}
            loading={loadingThumbnail}
            onChange={uploadThumbnail}
            option={{
              quality: 100,
              maxHeight: 800,
              maxWidth: 1300,
              minHeight: 800,
              minWidth: 1300,
              compressFormat: ECompressFormat.JPEG,
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

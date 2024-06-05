import { useRouter } from "next/router";
import {
  useState,
  useEffect,
  Fragment,
  ReactElement,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import FormLayout from "~/layouts/FormLayout";
import { InputText } from "~/components/InputField";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import Loading from "~/components/Loading";
import {
  deleteBanner,
  getBanner,
  updateBanner,
  uploadBannerImage,
} from "~/api-client";
import { Banner } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import { ECompressFormat, ETypeImage } from "~/enums";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { useTranslation } from "react-i18next";
import Popup from "~/components/Popup";

const initData: Banner = {
  _id: "",
  title: "",
  meta_title: "",
  isPublic: true,
  image: "",
  path: null,
};

const Layout = LayoutWithHeader;

const EditCategoryPage: NextPageWithLayout = () => {
  const router = useRouter();
  const banerId = router.query.id as string;

  const { t } = useTranslation();

  const [title, setTitle] = useState<string | null>(null);

  const [data, setData] = useState<Banner>(initData);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);

  const [image, setImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
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

  const handleDeleteCategory = useCallback(async () => {
    if (!data._id) return;

    try {
      await deleteBanner(data._id);
      setShowPopup(false);

      toast.success("Success delete banner", {
        position: toast.POSITION.TOP_RIGHT,
      });

      router.push("/banners");
    } catch (error) {
      toast.error("Error delete banner", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  }, [data]);

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
        const { status, payload } = await uploadBannerImage(formData);

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

  const handleOnSubmit = async () => {
    if (!data._id) return;

    const fields = checkData([
      {
        name: "title",
        value: data.title,
      },
      {
        name: "meta_title",
        value: data.meta_title,
      },
      {
        name: "image",
        value: image,
      },
    ]);

    if (fields.length > 0) {
      toast.error("Please input fields", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return;
    }

    setLoading(true);

    const sendData: Banner = {
      ...data,
      image: image as string,
    };

    try {
      const payload = await updateBanner(data._id, sendData);

      if (payload.status === 201) {
        toast.success("Success create banner", {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/banners");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Error in create category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const handleGetData = async (id: string) => {
    setLoading(true);

    try {
      const data = await getBanner(id);

      if (data.status === 200) {
        const title = data.payload.parent_id
          ? data.payload.parent_id.title
          : "Home";
        const node_id = data.payload.parent_id
          ? data.payload.parent_id._id
          : null;

        setData({
          _id: data.payload._id,
          title: data.payload.title,
          meta_title: data.payload.meta_title,
          image: data.payload.image,
          isPublic: data.payload.isPublic,
          path: data.payload.path,
        });
        setTitle(data.payload.title);
        setImage(data.payload.image);

        setLoading(false);
      }
    } catch (error) {
      toast.error("Error server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!banerId) return;

    handleGetData(banerId);
  }, [banerId, router.isReady]);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <FormLayout
      title={`${t("EditBannerPage.title")} ${title ? title : ""}`}
      backLink="/categories"
      onSubmit={handleOnSubmit}
    >
      <Fragment>
        <div className="lg:w-2/4 w-full mx-auto">
          <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
            <InputText
              title={t("CreateBannerPage.field.title")}
              error={fieldsCheck.includes("title")}
              width="w-full"
              value={data.title}
              name="title"
              getValue={changeValue}
            />

            <InputText
              title="Meta Title"
              error={fieldsCheck.includes("meta_title")}
              width="w-full"
              value={data.meta_title}
              name="meta_title"
              getValue={changeValue}
            />
          </div>

          <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
            <Thumbnail
              error={fieldsCheck.includes("image")}
              url={image}
              loading={loadingThumbnail}
              onChange={uploadThumbnail}
              option={{
                quality: 80,
                maxHeight: 600,
                maxWidth: 1000,
                minHeight: 600,
                minWidth: 1000,
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
                isChecked={data.isPublic}
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
        </div>

        {loading && <Loading />}

        {showPopup && (
          <Popup
            title="Xác nhận xóa Banner"
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

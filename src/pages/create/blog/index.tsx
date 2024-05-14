import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { toast } from "react-toastify";

import { CreateBanner, ICreateBlog, ISelectItem } from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import { InputText, InputTextarea } from "~/components/InputField";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import Loading from "~/components/Loading";
import { createBanner, uploadBannerImage } from "~/api-client";
import { ECompressFormat, ETypeImage } from "~/enums";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { NextPageWithLayout } from "~/interface/page";
import { useTranslation } from "react-i18next";
import MultipleValue from "~/components/InputField/MultipleValue";
import SelectMultipleItem from "~/components/Select/SelectMultipleItem";

const initData: ICreateBlog = {
  title: "",
  content: "",
  description: "",
  thumbnail: "",
  public: true,
  tags: [],
};

const initDataSelect: ISelectItem[] = [
  { _id: "1", title: "test 1" },
  { _id: "2", title: "test 2" },
  { _id: "3", title: "test 3" },
];

const Layout = LayoutWithHeader;

const CreateCategoryPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const [data, setData] = useState<ICreateBlog>(initData);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);
  const [mutipleTag, setMultipleTag] = useState<ISelectItem[]>([]);

  const [image, setImage] = useState<string | null>(null);

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

  const changeMultipleTag = (select: ISelectItem[]) => {
    console.log(select)
    // setMultipleTag(values);
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

    const sendData: CreateBanner = {
      ...data,
      image: image as string,
    };

    try {
      const payload = await createBanner(sendData);

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
            title="Meta Title"
            width="w-full"
            value={data.description}
            error={fieldsCheck.includes("description")}
            name="description"
            placeholder="Description blog.."
            getValue={changeValue}
          />

          <SelectMultipleItem
            title={t("CreateProductPage.field.categories")}
            width="w-full"
            select={mutipleTag}
            data={initDataSelect}
            name="categories"
            placeholder="Please select tag"
            error={fieldsCheck.includes("categories")}
            getSelect={changeMultipleTag}
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

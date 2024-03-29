import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { toast } from "react-toastify";

import { CreateBanner } from "~/interface";
import FormLayout from "~/layouts/FormLayout";
import { InputText } from "~/components/InputField";
import Thumbnail from "~/components/Image/Thumbnail";
import ButtonCheck from "~/components/Button/ButtonCheck";
import { handleCheckFields, handleRemoveCheck } from "~/helper/checkFields";
import Loading from "~/components/Loading";
import { createBanner, uploadBannerImage } from "~/api-client";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";

const initData: CreateBanner = {
  title: "",
  meta_title: "",
  isPublic: true,
  image: "",
  path: null,
};

const Layout = LayoutWithHeader;

const CreateCategoryPage = () => {
  const router = useRouter();

  const [data, setData] = useState<CreateBanner>(initData);
  const [fieldsCheck, setFieldsCheck] = useState<string[]>([]);

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
      title="Create Banner"
      backLink="/banners"
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
            placeholder="Title for banner..."
            getValue={changeValue}
          />

          <InputText
            title="Meta Title"
            width="w-full"
            value={data.meta_title}
            error={fieldsCheck.includes("meta_title")}
            name="meta_title"
            placeholder="Metat title for SEO..."
            getValue={changeValue}
          />
        </div>

        <div className="w-full flex flex-col p-5 mt-5 rounded-md border-2 gap-5">
          <Thumbnail
            error={fieldsCheck.includes("image")}
            url={image}
            loading={loadingThumbnail}
            onChange={uploadThumbnail}
          />

          <ButtonCheck
            title="Public"
            name="isPublic"
            width="w-fit"
            isChecked={data.isPublic}
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

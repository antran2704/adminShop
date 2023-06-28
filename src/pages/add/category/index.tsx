import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";

import HandleLayout from "./HandleLayout";

interface IThumbnailUrl {
  source: FileList | {};
  url: string;
}

interface IOption {
  title: string;
}

interface IDataCategory {
  title: string;
  description: string;
  thumbnail: string;
  options: IOption[];
}

const initData: IDataCategory = {
  title: "",
  description: "",
  thumbnail: "",
  options: [],
};

const AddCategoryPage = () => {
  const router = useRouter();

  const [data, setData] = useState<IDataCategory>(initData);
  const [selectOptionIndex, setSelectOptionIndex] = useState<number | null>(
    null
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<IThumbnailUrl>({
    source: {},
    url: "",
  });

  const changeValue = (name: string, value: string | number | boolean) => {
    setData({ ...data, [name]: value });
  };

  const uploadThumbnail = (source: object, url: string, name: string) => {
    if (source && url) {
      setThumbnailUrl({ source, url });
      setData({ ...data, [name]: url });
    }
  };

  const addOption = (newOption: string) => {
    setData({ ...data, options: [...data.options, { title: newOption }] });
  };

  const selectOption = (text: string, index: number) => {
    setSelectOptionIndex(index);
  };

  const editOption = (newOption: string) => {
    if (selectOptionIndex !== null) {
      const oldOptions = data.options;

      oldOptions[selectOptionIndex].title = newOption;

      setData({ ...data, options: [...oldOptions] });
    }
  };

  const deleteOption = () => {
    if (selectOptionIndex) {
      const oldOptions = data.options;

      oldOptions.splice(selectOptionIndex, 1);
      setData({ ...data, options: [...oldOptions] });
    }
  };

  const handleOnSubmit = async () => {
    const formData = new FormData();
    const source: any = thumbnailUrl.source;
    formData.append("thumbnail", source);

    try {
      const uploadPayload = await axios
        .post(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/uploadThumbnail`,
          formData
        )
        .then((res) => res.data);

      const payload = await axios
        .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/category`, {
          ...data,
          thumbnail: uploadPayload.payload.thumbnail,
        })
        .then((res) => res.data);

      if (payload.status === 200) {
        console.log("upload successfully");
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HandleLayout
      data={data}
      thumbnailUrl={thumbnailUrl}
      selectOptionIndex={selectOptionIndex}
      handleChangeValue={changeValue}
      uploadThumbnail={uploadThumbnail}
      addOption={addOption}
      selectOption={selectOption}
      editOption={editOption}
      deleteOption={deleteOption}
      handleOnSubmit={handleOnSubmit}
    />
  );
};

export default AddCategoryPage;

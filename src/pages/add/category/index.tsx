import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";

import { IThumbnailUrl, IDataCategory } from "~/interface/category";
import HandleLayout from "~/layouts/CategoryLayout/HandleLayout";
import { uploadImageOnServer } from "~/helper/handleImage";

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

  const changeValue = (
    name: string | undefined,
    value: string | number | boolean
  ) => {
    if (name && value) {
      setData({ ...data, [name]: value });
    }
  };

  const uploadThumbnail = (source: object, url: string) => {
    if (source && url) {
      setThumbnailUrl({ source, url });
      setData({ ...data, thumbnail: url });
    }
  };

  const addOption = (newOption: string) => {
    setData({ ...data, options: [...data.options, { title: newOption }] });
  };

  const selectOption = (index: number) => {
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
    const formData: FormData = new FormData();
    const source: any = thumbnailUrl.source;
    formData.append("thumbnail", source);

    try {
      const uploadPayload = await uploadImageOnServer(
        `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/uploadThumbnail`,
        formData
      );

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

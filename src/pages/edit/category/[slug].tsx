import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";

import { deleteImageInSever } from "~/helper/handleImage";
import HandleLayout from "~/pages/add/category/HandleLayout";

interface IThumbnailUrl {
  source: FileList | {};
  url: string;
}

interface IOption {
  title: string;
}

interface IDataCategory {
  id: string | null;
  title: string;
  description: string;
  thumbnail: string;
  options: IOption[];
}

const initData: IDataCategory = {
  id: null,
  title: "",
  description: "",
  thumbnail: "",
  options: [],
};

interface Prop {
  query: any;
}

const EditCategoryPage = (prop: Prop) => {
  const router = useRouter();
  const { query } = prop;

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
    let payload;
    let currentData = {
      title: data.title,
      description: data.description,
      thumbnai: data.thumbnail,
      options: data.options,
    };

    try {
      if (data.thumbnail !== thumbnailUrl.url) {
        const formData = new FormData();
        const source: any = thumbnailUrl.source;
        formData.append("thumbnail", source);
        const deleteImagePayload = await deleteImageInSever(data.thumbnail);
        if (deleteImagePayload.status === 200) {
          const uploadPayload = await axios
            .post(
              `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/uploadThumbnail`,
              formData
            )
            .then((res) => res.data);
          console.log("thay doi anh thanh cong");

          payload = await axios
            .patch(
              `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/${data.id}`,
              {
                ...data,
                thumbnail: uploadPayload.payload.thumbnail,
              }
            )
            .then((res) => res.data);
        }
      } else {
        payload = await axios
          .patch(
            `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/${data.id}`,
            data
          )
          .then((res) => res.data);
      }

      if (payload.status === 200) {
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetData = async () => {
    const slug = query.slug;

    try {
      const data = await axios
        .get(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/${slug}`)
        .then((res) => res.data);
      console.log(data);
      if (data.status === 200) {
        setData({
          id: data.payload._id,
          title: data.payload.title,
          description: data.payload.description,
          thumbnail: data.payload.thumbnail,
          options: data.payload.options.list || [],
        });

        setThumbnailUrl({ ...thumbnailUrl, url: data.payload.thumbnail });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

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

export default EditCategoryPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

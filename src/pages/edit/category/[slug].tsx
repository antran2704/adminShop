import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, ChangeEvent, useEffect } from "react";

import FieldAdd from "~/components/FieldAdd";
import Thumbnail from "~/components/Image/Thumbnail";

import { uploadImage } from "~/helper/handleImage";
import AddLayout from "~/layouts/AddLayout";

interface IThumbnailUrl {
  source: FileList | {};
  url: string;
}

interface IDataCategory {
  title: string;
  description: string;
  thumbnail: string;
  filters: string[];
}

const initData: IDataCategory = {
  title: "",
  description: "",
  thumbnail: "",
  filters: [],
};

interface Prop {
  query: any;
}

const EditCategoryPage = (prop: Prop) => {
  const router = useRouter();
  const { query } = prop;

  const [data, setData] = useState<IDataCategory>(initData);
  const [thumbnailUrl, setThumbnailUrl] = useState<IThumbnailUrl>({
    source: {},
    url: "",
  });

  const handleChangeValue = (
    name: string,
    value: string | number | boolean
  ) => {
    setData({ ...data, [name]: value });
  };

  const handleUploadThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (/^image\//.test(file.type)) {
        const name = e.target.name;
        const source: object = file;
        const url: string = uploadImage(e.target);

        setThumbnailUrl({ source, url });
        setData({ ...data, [name]: { url, source } });
      }
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

  const handleGetData = async () => {
    const slug = query.slug;

    try {
      const data = await axios
        .get(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/${slug}`)
        .then((res) => res.data);

      if (data.status === 200) {
        setData({
          title: data.payload.title,
          description: data.payload.description,
          thumbnail: data.payload.thumbnail,
          filters: [],
        });

        setThumbnailUrl({...thumbnailUrl, url: data.payload.thumbnail});
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <AddLayout onSubmit={handleOnSubmit}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
          <FieldAdd
            title="Title"
            value={data.title}
            widthFull={false}
            name="title"
            type="input"
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Description"
            value={data.description}
            widthFull={true}
            name="description"
            type="textarea"
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            thumbnailUrl={thumbnailUrl.url}
            onChange={handleUploadThumbnail}
          />
        </div>
      </div>
    </AddLayout>
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

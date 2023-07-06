import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import { IProductData, ICategory } from "~/interface/product";
import HandleLayout from "~/layouts/ProductLayout/HandleLayout";

import {
  uploadGalleryOnServer,
  uploadImageOnServer,
} from "~/helper/handleImage";

const initData: IProductData = {
  title: "",
  category: null,
  type: [],
  shortDescription: "",
  description: "",
  price: 0,
  promotionPrice: null,
  quantity: 0,
  thumbnail: { source: {}, urlBase64: "" },
  gallery: [],
  brand: null,
  options: [],
  hotProduct: false,
  status: true,
};

const AddProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getCategories = async () => {
    try {
      const data = await axios
        .get(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/product/getCategories`)
        .then((res) => res.data);

      if (data.status === 200) {
        setCategories(data.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (data: IProductData) => {
    const handleUploadThumbnail = async () => {
      const formData: FormData = new FormData();
      const source: any = data.thumbnail.source;
      formData.append("thumbnail", source);

      const payload = await uploadImageOnServer(
        `${process.env.NEXT_PUBLIC_ENDPOINT_API}/product/uploadThumbnail`,
        formData
      );

      return payload;
    };

    try {
      const thumbailPayload = await handleUploadThumbnail();
      const formGallery: FormData = new FormData();

      for (let i = 0; i < data.gallery.length; i++) {
        const source: any = data.gallery[i].source;
        formGallery.append("gallery", source);
      }

      const galleryPayload = await uploadGalleryOnServer(
        `${process.env.NEXT_PUBLIC_ENDPOINT_API}/product/uploadGallery`,
        formGallery
      );

      if (thumbailPayload.status === 200 && galleryPayload.status === 200) {
        data.thumbnail = thumbailPayload.payload.thumbnail;
        data.gallery = galleryPayload.payload.gallery;

        const response = await axios
          .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/product`, data)
          .then((res) => res.data);

        if (response.status === 200) {
          router.back();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <HandleLayout
      onSubmit={handleSubmit}
      initData={initData}
      categories={categories}
    />
  );
};

export default AddProductPage;

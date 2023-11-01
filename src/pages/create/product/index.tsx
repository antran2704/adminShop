import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { axiosGet, axiosPost } from "~/ultils/configAxios";

import { ICategory, ITypeProduct, IListOption } from "~/interface/product";

import {
  uploadGalleryOnServer,
  uploadImageOnServer,
} from "~/helper/handleImage";

import HandleLayout from "~/layouts/ProductLayout/HandleLayout";
import { IThumbnail } from "~/interface/image";

interface IData {
  title: string;
  description: string;
  shortDescription: string;
}

const data: IData = {
  title: "",
  description: "",
  shortDescription: "",
};

const selectCategory: ICategory = {
  _id: null,
  options: null,
  title: null,
};

const thumbnail: IThumbnail = {
  source: {},
  urlBase64: "",
};

const gallery: IThumbnail[] = [];

const productType: ITypeProduct[] = [];
const options: IListOption[] = [];

const price: number = 0;
const promotionPrice: number | null = null;
const quantity: number = 0;

const status: boolean = true;

const AddProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getCategories = async () => {
    try {
      const data = await axiosGet("/product/getCategories");

      if (data.status === 200) {
        setCategories(data.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (
    currentData: any,
    currentThumbnail: IThumbnail,
    currentGallery: IThumbnail[]
  ) => {
    const handleUploadThumbnail = async () => {
      const formData: FormData = new FormData();
      const source: any = currentThumbnail.source;
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
      console.log(currentGallery);

      for (let i = 0; i < currentGallery.length; i++) {
        const source: any = currentGallery[i].source;
        formGallery.append("gallery", source);
      }

      const galleryPayload = await uploadGalleryOnServer(
        `${process.env.NEXT_PUBLIC_ENDPOINT_API}/product/uploadGallery`,
        formGallery
      );

      if (thumbailPayload.status === 200 && galleryPayload.status === 200) {
        const sendData = {
          ...currentData,
          thumbnail: thumbailPayload.payload.thumbnail,
          gallery: galleryPayload.payload.gallery,
        };

        const response = await axiosPost("/product", sendData)

        if (response.status === 200) {
          toast.success("Success add product", {
            position: toast.POSITION.TOP_RIGHT,
          });
          router.back();
        }
      }
    } catch (error) {
      toast.error("Error add product", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <HandleLayout
      data={data}
      categories={categories}
      selectCategory={selectCategory}
      productType={productType}
      price={price}
      promotionPrice={promotionPrice}
      thumbnail={thumbnail}
      gallery={gallery}
      quantity={quantity}
      options={options}
      status={status}
      onSubmit={onSubmit}
    />
  );
};

export default AddProductPage;

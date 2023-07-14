import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  IOption,
  IListOption,
  IProductData,
  ICategory,
  ITypeProduct,
} from "~/interface/product";
import { IThumbnail } from "~/interface/image";

import {
  deleteGallery,
  uploadGalleryOnServer,
  uploadImageOnServer,
} from "~/helper/handleImage";
import HandleLayout from "~/layouts/ProductLayout/HandleLayout";

interface Props {
  query: any;
}

interface IData {
  _id: String | null;
  title: string;
  description: string;
  shortDescription: string;
}

const initData: IData = {
  _id: null,
  title: "",
  description: "",
  shortDescription: "",
};

const initSelectCategory: ICategory = {
  _id: null,
  options: null,
  title: null,
};

const initThumbnail: IThumbnail = {
  source: {},
  urlBase64: "",
};

const EditProductPage = (props: Props) => {
  const { query } = props;
  const router = useRouter();

  const [data, setData] = useState<IData>(initData);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectCategory, setSelectCategory] =
    useState<ICategory>(initSelectCategory);
  const [selectProductType, setSelectType] = useState<ITypeProduct[]>([]);

  const [productType, setProductType] = useState<ITypeProduct[]>([]);
  const [options, setOptions] = useState<IListOption[]>([]);
  console.log(selectProductType);
  const [thumbnail, setThumbnail] = useState<IThumbnail>(initThumbnail);
  const [gallery, setGallery] = useState<IThumbnail[]>([]);

  const [price, setPrice] = useState<number>(0);
  const [promotionPrice, setPromotionPrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const [status, setStatus] = useState<boolean>(true);

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

        const response = await axios
          .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/product`, sendData)
          .then((res) => res.data);

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

  const handleGetData = async () => {
    const { slug } = query;
    try {
      const response = await axios
        .get(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/product/${slug}`)
        .then((res) => res.data);

      if (response.status === 200) {
        const dataRes: IProductData = response.payload;
        let galleryRes: IThumbnail[] = [];

        if (dataRes.gallery.length > 0) {
          galleryRes = dataRes.gallery.map((url: any) => {
            return {
              source: {},
              urlBase64: url,
            };
          });
        }

        if (dataRes._id && dataRes.category && dataRes.category.options) {
          setData({
            _id: dataRes._id,
            title: dataRes.title,
            description: dataRes.description,
            shortDescription: dataRes.shortDescription,
          });
          setSelectCategory(dataRes.category);
          setSelectType(dataRes.type);
          setThumbnail({
            source: {},
            urlBase64: dataRes.thumbnail,
          });
          setGallery(galleryRes);
          setPrice(dataRes.price);
          setPromotionPrice(dataRes.promotionPrice);
          setQuantity(dataRes.quantity);
          setOptions(dataRes.options);
          setStatus(dataRes.status);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetData();
    getCategories();
  }, []);

  return (
    <>
      {data._id && (
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
      )}
    </>
  );
};

export default EditProductPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

import qs from "qs";

import { uploadImageOnServer } from "~/helper/handleImage";
import { ICreateProduct, IFilter, ISearch } from "~/interface";
import httpConfig, {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getProducts = async (paramater: ISearch) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await httpConfig
    .get(BASE_URL + `/admin/products?${parseParameters}`)
    .then((res) => res.data);
};

const getProduct = async (product_id: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/products/id/${product_id}`)
    .then((res) => res.data);
};

const createProduct = async (data: ICreateProduct) => {
  return await axiosPost(BASE_URL + "/admin/products", data);
};

const updateProduct = async (product_id: string, data: any) => {
  return await axiosPatch(BASE_URL + `/admin/products/${product_id}`, data);
};

const uploadThumbnailProduct = async (formData: FormData) => {
  return await uploadImageOnServer(
    BASE_URL + `/admin/products/uploadImage`,
    formData,
  );
};

const deleteProduct = async (product_id: string) => {
  return await axiosDelete(BASE_URL + `/admin/products/${product_id}`);
};

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  uploadThumbnailProduct,
  deleteProduct,
};

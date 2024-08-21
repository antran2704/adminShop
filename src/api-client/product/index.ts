import qs from "qs";

import { uploadImageOnServer } from "~/helper/handleImage";
import { ICreateProduct, ISearch } from "~/interface";
import httpConfig from "~/configs/configAxios";

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
  return await httpConfig
    .post(BASE_URL + "/admin/products", data)
    .then((res) => res.data);
};

const updateProduct = async (product_id: string, data: any) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/products/${product_id}`, data)
    .then((res) => res.data);
};

const activeProduct = async (product_id: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/products/${product_id}/active`)
    .then((res) => res.data);
};

const disableProduct = async (product_id: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/products/${product_id}/disable`)
    .then((res) => res.data);
};

const uploadThumbnailProduct = async (formData: FormData) => {
  return await uploadImageOnServer(
    BASE_URL + `/admin/products/uploadImage`,
    formData,
  );
};

const deleteProduct = async (product_id: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/products/${product_id}`)
    .then((res) => res.data);
};

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  disableProduct,
  activeProduct,
  uploadThumbnailProduct,
  deleteProduct,
};

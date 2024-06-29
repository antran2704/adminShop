import { uploadImageOnServer } from "~/helper/handleImage";
import { IFilter, ISendProduct } from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getProducts = async (page: number = 1) => {
  return await axiosGet(BASE_URL + `/admin/products?page=${page}`);
};

const getProduct = async (product_id: string) => {
  return await axiosGet(BASE_URL + `/admin/products/id/${product_id}`);
};

const getProductsWithFilter = async (
  filter: IFilter | null,
  page: number = 1
) => {
  return await axiosGet(
    BASE_URL + `/admin/products/search?search=${filter?.search || ""}&category=${
      filter?.category || ""
    }&page=${page}`
  );
};

const createProduct = async (data: ISendProduct) => {
  return await axiosPost(BASE_URL + "/admin/products", data);
};

const updateProduct = async (
  product_id: string,
  data: Partial<ISendProduct>
) => {
  return await axiosPatch(BASE_URL + `/admin/products/${product_id}`, data);
};

const uploadThumbnailProduct = async (formData: FormData) => {
  return await uploadImageOnServer(
    BASE_URL + `${process.env.NEXT_PUBLIC_ENDPOINT_API}/admin/products/uploadImage`,
    formData
  );
};

const deleteProduct = async (product_id: string) => {
  return await axiosDelete(BASE_URL + `/admin/products/${product_id}`);
};

export {
  getProducts,
  getProduct,
  getProductsWithFilter,
  createProduct,
  updateProduct,
  uploadThumbnailProduct,
  deleteProduct,
};

import { IVariantProduct } from "~/interface";
import { axiosGet, axiosPatch, axiosPost } from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getVariations = async (page: number = 1) => {
  return await axiosGet(BASE_URL + `/products?page=${page}`);
};

const createVariations = async (
  product_id: string,
  data: IVariantProduct[]
) => {
  return await axiosPost(BASE_URL + `/variations/${product_id}`, data);
};

const updateVariations = async (data: string[]) => {
  return await axiosPatch(BASE_URL + "/variations/items", data);
};

export { getVariations, createVariations, updateVariations };

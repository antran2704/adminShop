import { IVariantProduct } from "~/interface";
import { axiosGet, axiosPatch, axiosPost } from "~/ultils/configAxios";

const getVariations = async (page: number = 1) => {
  return await axiosGet(`/products?page=${page}`);
};

const createVariations = async (
  product_id: string,
  data: IVariantProduct[]
) => {
  return await axiosPost(`/variations/${product_id}`, data);
};

const updateVariations = async (data: string[]) => {
  return await axiosPatch("/variations/items", data);
};

export { getVariations, createVariations, updateVariations };

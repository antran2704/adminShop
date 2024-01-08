import { IVariantProduct } from "~/interface";
import {
  axiosGet,
  axiosPost,
} from "~/ultils/configAxios";

const getVariations = async (page: number = 1) => {
  return await axiosGet(`/products?page=${page}`);
};

const createVariations = async (data: IVariantProduct[]) => {
  return await axiosPost("/variations", data);
};

export {
  getVariations,
  createVariations
};

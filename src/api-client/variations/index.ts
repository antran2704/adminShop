import qs from "qs";

import { ICreateVariant, ISearch, IVariantProduct } from "~/interface";
import httpConfig from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getVariations = async (productId: string, paramater: ISearch) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });
  return await httpConfig
    .get(BASE_URL + `/admin/variations/${productId}?${parseParameters}`)
    .then((res) => res.data);
};

const createVariations = async (product_id: string, data: ICreateVariant[]) => {
  return await httpConfig
    .post(BASE_URL + `/admin/variations/${product_id}`, data)
    .then((res) => res.data);
};

const updateVariation = async (variantId: string, data: ICreateVariant) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/variations/${variantId}`, data)
    .then((res) => res.data);
};

const deleteVariation = async (variantId: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/variations/${variantId}`)
    .then((res) => res.data);
};

const deleteAllVariationsInProduct = async (productId: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/variations/${productId}/all`)
    .then((res) => res.data);
};

export {
  getVariations,
  createVariations,
  updateVariation,
  deleteVariation,
  deleteAllVariationsInProduct,
};

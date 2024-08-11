import qs from "qs";

import { ISearch, IVariantProduct } from "~/interface";
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

const createVariations = async (
  product_id: string,
  data: IVariantProduct[],
) => {
  return await httpConfig
    .post(BASE_URL + `/admin/variations/${product_id}`, data)
    .then((res) => res.data);
};

const updateVariations = async (data: string[]) => {
  return await httpConfig
    .patch(BASE_URL + "/admin/variations/items", data)
    .then((res) => res.data);
};

export { getVariations, createVariations, updateVariations };

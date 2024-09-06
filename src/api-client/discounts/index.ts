import httpConfig from "~/configs/configAxios";
import { parseQueryString } from "~/helper/url";
import { ISearch } from "~/interface";
import { ICreateDiscount } from "~/interface/discount";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getDiscounts = async (query: ISearch) => {
  const parseQuery = parseQueryString(query);

  return await httpConfig
    .get(BASE_URL + "/admin/discounts" + parseQuery)
    .then((res) => res.data);
};

const getDiscount = async (id: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/discounts/id/${id}`)
    .then((res) => res.data);
};

const createDiscount = async (data: ICreateDiscount) => {
  return await httpConfig
    .post(BASE_URL + "/admin/discounts", data)
    .then((res) => res.data);
};

const updateDiscount = async (discountId: string, data: ICreateDiscount) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/discounts/${discountId}`, data)
    .then((res) => res.data);
};

const uploadDiscountThumbnail = async (formData: FormData) => {
  return await httpConfig
    .post(BASE_URL + `/admin/discounts/uploadThumbnail`, formData)
    .then((res) => res.data);
};

const activeDiscount = async (discountId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/discounts/${discountId}/active`)
    .then((res) => res.data);
};

const disableDiscount = async (discountId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/discounts/${discountId}/disable`)
    .then((res) => res.data);
};

const deleteDiscount = async (discountId: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/discounts/${discountId}`)
    .then((res) => res.data);
};

export {
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  activeDiscount,
  disableDiscount,
  uploadDiscountThumbnail,
  deleteDiscount,
};

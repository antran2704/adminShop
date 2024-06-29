import qs from "qs";
import {
  AxiosRequestHeadersCus,
  ICoupon,
  IFilter,
  IQueryParam,
} from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
} from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getCoupons = async (
  page: number = 1,
  select?: IQueryParam<Partial<ICoupon>>,
  headers?: Partial<AxiosRequestHeadersCus>
) => {
  const parseQuery = qs.stringify(select);
  return await axiosGet(BASE_URL + `/discounts?page=${page}&${parseQuery}`, {
    headers,
  });
};

const getCouponsWithFilter = async (
  filter: IFilter | null,
  page: number = 1,
  select?: IQueryParam<Partial<ICoupon>>,
  headers?: Partial<AxiosRequestHeadersCus>
) => {
  const parseQuery = qs.stringify(select);

  return await axiosGet(
    BASE_URL + `/discounts/search?search=${filter?.search || ""}&start_date=${
      filter?.start_date || ""
    }&end_date=${filter?.end_date || ""}&${parseQuery}&page=${page}`,
    {
      headers,
    }
  );
};

const updateCoupon = async (
  coupon_id: string,
  data: Partial<ICoupon>,
  headers?: Partial<AxiosRequestHeadersCus>
) => {
  return await axiosPatch(BASE_URL + `/discounts/${coupon_id}`, data, { headers });
};

const deleteCoupon = async (coupon_id: string, headers?: Partial<AxiosRequestHeadersCus>) => {
  return await axiosDelete(BASE_URL + `/discounts/${coupon_id}`, {headers});
};

export { getCoupons, getCouponsWithFilter, updateCoupon, deleteCoupon };

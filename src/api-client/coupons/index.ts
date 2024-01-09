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
  axiosPost,
} from "~/ultils/configAxios";

const getCoupons = async (
  page: number = 1,
  select?: IQueryParam<Partial<ICoupon>>,
  headers?: Partial<AxiosRequestHeadersCus>
) => {
  const parseQuery = qs.stringify(select);
  return await axiosGet(`/discounts?page=${page}&${parseQuery}`, {
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
    `/discounts/search?search=${filter?.search || ""}&start_date=${
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
  return await axiosPatch(`/discounts/${coupon_id}`, data, { headers });
};

const deleteCoupon = async (coupon_id: string) => {
  return await axiosDelete(`/discounts/${coupon_id}`);
};

export { getCoupons, getCouponsWithFilter, updateCoupon, deleteCoupon };

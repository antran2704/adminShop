import { IBanner, ICreateBanner, ISearch } from "~/interface";
import httpConfig from "~/configs/configAxios";
import { parseQueryString } from "~/helper/url";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getBanners = async (paramater: ISearch) => {
  const parseParameters = parseQueryString(paramater);

  return await httpConfig
    .get(BASE_URL + `/admin/banners?${parseParameters}`)
    .then((res) => res.data);
};

const getBanner = async (banner_id: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/banners/${banner_id}`)
    .then((res) => res.data);
};

const createBanner = async (data: ICreateBanner) => {
  return await httpConfig
    .post(BASE_URL + "/admin/banners", data)
    .then((res) => res.data);
};

const updateBanner = async (banner_id: string, data: Partial<IBanner>) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/banners/${banner_id}`, data)
    .then((res) => res.data);
};

const activeBanner = async (banner_id: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/banners/${banner_id}/active`)
    .then((res) => res.data);
};

const disableBanner = async (banner_id: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/banners/${banner_id}/disable`)
    .then((res) => res.data);
};

const uploadBannerImage = async (formData: FormData) => {
  return await httpConfig
    .post(BASE_URL + `/admin/banners/uploadThumbnail`, formData)
    .then((res) => res.data);
};

const deleteBanner = async (banner_id: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/banners/${banner_id}`)
    .then((res) => res.data);
};

export {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  uploadBannerImage,
  activeBanner,
  disableBanner,
  deleteBanner,
};

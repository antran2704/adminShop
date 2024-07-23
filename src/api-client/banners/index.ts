import qs from "qs";

import { uploadImageOnServer } from "~/helper/handleImage";
import { IBanner, CreateBanner, ISearch } from "~/interface";
import httpConfig, {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getBanners = async (paramater: ISearch) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await axiosGet(BASE_URL + `/admin/banners?${parseParameters}`);
};

const getBanner = async (banner_id: string) => {
  return await axiosGet(BASE_URL + `/banners/${banner_id}`);
};

const createBanner = async (data: CreateBanner) => {
  return await axiosPost(BASE_URL + "/banners", data);
};

const updateBanner = async (banner_id: string, data: Partial<IBanner>) => {
  return await axiosPatch(BASE_URL + `/banners/${banner_id}`, data);
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
  return await uploadImageOnServer(BASE_URL + `/banners/uploadImage`, formData);
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

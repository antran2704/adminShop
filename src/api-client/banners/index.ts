import { uploadImageOnServer } from "~/helper/handleImage";
import { Banner, CreateBanner} from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";

const getBanners = async (page: number = 1) => {
  return await axiosGet(`/banners/admin?page=${page}`);
};

const getBanner = async (banner_id: string) => {
  return await axiosGet(`/banners/${banner_id}`);
};

const createBanner = async (data: CreateBanner) => {
  return await axiosPost("/banners", data);
};

const updateBanner = async (
  banner_id: string,
  data: Partial<Banner>
) => {
  return await axiosPatch(`/banners/${banner_id}`, data);
};

const uploadBannerImage = async (formData: FormData) => {
  return await uploadImageOnServer(
    `${process.env.NEXT_PUBLIC_ENDPOINT_API}/banners/uploadImage`,
    formData
  );
};

const deleteBanner = async (banner_id: string) => {
  return await axiosDelete(`/banners/${banner_id}`);
};

export {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  uploadBannerImage,
  deleteBanner
};

import qs from "qs";

import { uploadImageOnServer } from "~/helper/handleImage";
import { IDataCategory, IFilter, IQueryParam } from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getCategories = async (page: number = 1) => {
  return await axiosGet(BASE_URL + `/admin/categories?page=${page}`);
};

const getCategory = async (category_id: string) => {
  return await axiosGet(BASE_URL + `/admin/categories/id/${category_id}`);
};

const getParentCategories = async () => {
  return await axiosGet(BASE_URL + "/admin/categories/parent");
};

const getAllCategories = async (
  select?: IQueryParam<Partial<IDataCategory>>
) => {
  const parseQuery = qs.stringify(select);
  return await axiosGet(BASE_URL + `/admin/categories/all?${parseQuery}`);
};

const getCategoriesWithFilter = async (
  filter: IFilter | null,
  page: number = 1
) => {
  return await axiosGet(
    BASE_URL + `/admin/categories/search?search=${filter?.search || ""}&page=${page}`
  );
};

const createCategory = async (data: Partial<IDataCategory>) => {
  return await axiosPost(BASE_URL + "/admin/categories", data);
};

const updateCategory = async (
  category_id: string,
  data: Partial<IDataCategory>
) => {
  return await axiosPatch(BASE_URL + `/admin/categories/${category_id}`, data);
};

const uploadThumbnailCategory = async (formData: FormData) => {
  return await uploadImageOnServer(
    BASE_URL + `${process.env.NEXT_PUBLIC_ENDPOINT_API}/admin/categories/uploadThumbnail`,
    formData
  );
};

const deleteCategory = async (category_id: string) => {
  return await axiosDelete(BASE_URL + `/admin/categories/${category_id}`);
};

export {
  getCategories,
  getAllCategories,
  getParentCategories,
  getCategoriesWithFilter,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  uploadThumbnailCategory,
};

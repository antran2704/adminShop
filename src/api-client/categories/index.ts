import qs from "qs";

import { ICategory, IFilter, ISearch } from "~/interface";
import httpConfig from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getCategories = async (paramater: ISearch) => {
  const parseParameters = qs.stringify(paramater, {
    indices: false,
    filter: (_, value) => value || undefined,
  });

  return await httpConfig
    .get(BASE_URL + `/admin/categories?${parseParameters}`)
    .then((res) => res.data);
};

const getCategory = async (category_id: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/categories/id/${category_id}`)
    .then((res) => res.data);
};

const getParentCategories = async () => {
  return await httpConfig
    .get(BASE_URL + "/admin/categories/parent")
    .then((res) => res.data);
};

const getParentCategory = async (categoryId: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/categories/parent/${categoryId}`)
    .then((res) => res.data);
};

const getChildInCategory = async (categoryId: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/categories/child/${categoryId}`)
    .then((res) => res.data);
};

const getCategoriesWithFilter = async (
  filter: IFilter | null,
  page: number = 1,
) => {
  return await httpConfig
    .get(
      BASE_URL +
        `/admin/categories/search?search=${filter?.search || ""}&page=${page}`,
    )
    .then((res) => res.data);
};

const createCategory = async (data: Partial<ICategory>) => {
  return await httpConfig
    .post(BASE_URL + "/admin/categories", data)
    .then((res) => res.data);
};

const updateCategory = async (
  category_id: string,
  data: Partial<ICategory>,
) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/categories/${category_id}`, data)
    .then((res) => res.data);
};

const activeCategory = async (id: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/categories/${id}/active`)
    .then((res) => res.data);
};

const disableCategory = async (id: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/categories/${id}/disable`)
    .then((res) => res.data);
};

const uploadThumbnailCategory = async (formData: FormData) => {
  return await httpConfig
    .post(BASE_URL + `/admin/categories/uploadThumbnail`, formData)
    .then((res) => res.data);
};

const deleteCategory = async (category_id: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/categories/${category_id}`)
    .then((res) => res.data);
};

export {
  getCategories,
  getParentCategories,
  getParentCategory,
  getChildInCategory,
  getCategoriesWithFilter,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  uploadThumbnailCategory,
  disableCategory,
  activeCategory,
};

import { uploadImageOnServer } from "~/helper/handleImage";
import httpConfig from "~/configs/configAxios";
import { parseQueryString } from "~/helper/url";
import { ISearch } from "~/interface";
import { ICreateBlog } from "~/interface/blog";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getBlogs = async (paramater: ISearch) => {
  const parseParameters = parseQueryString(paramater);
  return await httpConfig
    .get(BASE_URL + "/admin/blogs" + parseParameters)
    .then((res) => res.data);
};

const getBlog = async (blogId: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/blogs/id/${blogId}`)
    .then((res) => res.data);
};

const createBlog = async (payload: ICreateBlog) => {
  return await httpConfig
    .post(BASE_URL + "/admin/blogs", payload)
    .then((res) => res.data);
};

const updateBlog = async (blogId: string, data: ICreateBlog) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/blogs/${blogId}`, data)
    .then((res) => res.data);
};

const uploadBlogImage = async (formData: FormData) => {
  return await uploadImageOnServer(
    BASE_URL + `/admin/blogs/uploadImage`,
    formData,
  ).then((res) => res.data);
};

const activeBlog = async (blogId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/blogs/${blogId}/active`)
    .then((res) => res.data);
};

const disableBlog = async (blogId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/blogs/${blogId}/disable`)
    .then((res) => res.data);
};

const deleteBlog = async (blogId: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/blogs/${blogId}`)
    .then((res) => res.data);
};

export {
  getBlogs,
  getBlog,
  updateBlog,
  uploadBlogImage,
  disableBlog,
  activeBlog,
  deleteBlog,
  createBlog,
};

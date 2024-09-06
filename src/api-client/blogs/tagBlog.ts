import { uploadImageOnServer } from "~/helper/handleImage";
import httpConfig from "~/configs/configAxios";
import { parseQueryString } from "~/helper/url";
import { IBlogTagSearch, ICreateBlogTag } from "~/interface/blog/blogTag";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getTagBlogs = async (paramater: IBlogTagSearch) => {
  const parseParameters = parseQueryString(paramater);
  return await httpConfig
    .get(BASE_URL + "/admin/blog-tags" + parseParameters)
    .then((res) => res.data);
};

const getTagBlog = async (tagId: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/blog-tags/id/${tagId}`)
    .then((res) => res.data);
};

const createTagBlog = async (payload: ICreateBlogTag) => {
  return await httpConfig
    .post(BASE_URL + "/admin/blog-tags", payload)
    .then((res) => res.data);
};

const updateTagBlog = async (tagId: string, data: ICreateBlogTag) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/blog-tags/${tagId}`, data)
    .then((res) => res.data);
};

const uploadTagBlogImage = async (formData: FormData) => {
  return await uploadImageOnServer(
    BASE_URL + `/admin/blog-tags/uploadImage`,
    formData,
  ).then((res) => res.data);
};

const activeTagBlog = async (tagId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/blog-tags/${tagId}/active`)
    .then((res) => res.data);
};

const disableTagBlog = async (tagId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/blog-tags/${tagId}/disable`)
    .then((res) => res.data);
};

const deleteTagBlog = async (tagId: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/blog-tags/${tagId}`)
    .then((res) => res.data);
};

export {
  getTagBlogs,
  getTagBlog,
  updateTagBlog,
  uploadTagBlogImage,
  activeTagBlog,
  disableTagBlog,
  createTagBlog,
  deleteTagBlog,
};

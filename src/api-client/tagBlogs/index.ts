import qs from "qs";
import { uploadImageOnServer } from "~/helper/handleImage";
import { IBlog, ICreateTagBlog, IFilter, IQueryParam } from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getTagBlogs = async (page: number = 1) => {
  return await axiosGet(BASE_URL + `/admin/blogs-tag?page=${page}`);
};

const getTagBlog = async (blog_id: string) => {
  return await axiosGet(BASE_URL + `/admin/blogs-tag/${blog_id}`);
};

const getTagBlogsWithFilter = async (
  filter: IFilter | null,
  query?: IQueryParam<Partial<IBlog>>,
  page: number = 1
) => {
  const parseQuery = qs.stringify(query);
  return await axiosGet(
    BASE_URL +
      `/admin/blogs-tag/search?search=${filter?.search || ""}${
        parseQuery && "&" + parseQuery
      }&page=${page}`
  );
};

const createTagBlog = async (payload: ICreateTagBlog) => {
  return await axiosPost(BASE_URL + "/admin/blogs-tag", payload);
};

const updateTagBlog = async (
  tag_id: string,
  options?: Partial<ICreateTagBlog>
) => {
  return await axiosPatch(BASE_URL + `/admin/blogs-tag/${tag_id}`, {
    ...options,
  });
};

const uploadTagBlogImage = async (formData: FormData) => {
  return await uploadImageOnServer(
    BASE_URL +
      `${process.env.NEXT_PUBLIC_ENDPOINT_API}/admin/blogs-tag/uploadImage`,
    formData
  );
};

const deleteTagBlog = async (tag_id: string) => {
  return await axiosDelete(BASE_URL + `/admin/blogs-tag/${tag_id}`);
};

export {
  getTagBlogs,
  getTagBlogsWithFilter,
  getTagBlog,
  updateTagBlog,
  uploadTagBlogImage,
  createTagBlog,
  deleteTagBlog,
};

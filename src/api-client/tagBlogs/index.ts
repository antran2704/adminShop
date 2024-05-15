import qs from "qs";
import { IBlog, ICreateTagBlog, IFilter, IQueryParam } from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";

const getTagBlogs = async (page: number = 1) => {
  return await axiosGet(`/admin/blogs-tag?page=${page}`);
};

const getTagBlog = async (blog_id: string) => {
  return await axiosGet(`/admin/blogs-tag/${blog_id}`);
};

const getTagBlogsWithFilter = async (
  filter: IFilter | null,
  query?: IQueryParam<Partial<IBlog>>,
  page: number = 1
) => {
  const parseQuery = qs.stringify(query);
  return await axiosGet(
    `/admin/blogs-tag/search?search=${filter?.search || ""}${
      parseQuery && "&" + parseQuery
    }&page=${page}`
  );
};

const createTagBlog = async (payload: ICreateTagBlog) => {
  return await axiosPost("/admin/blogs-tag", payload);
};

const updateTagBlog = async (
  tag_id: string,
  options?: Partial<ICreateTagBlog>
) => {
  return await axiosPatch(`/admin/blogs-tag/${tag_id}`, {
    ...options,
  });
};

const deleteTagBlog = async (tag_id: string) => {
  return await axiosDelete(`/admin/blogs-tag/${tag_id}`);
};

export {
  getTagBlogs,
  getTagBlogsWithFilter,
  getTagBlog,
  updateTagBlog,
  createTagBlog,
  deleteTagBlog
};
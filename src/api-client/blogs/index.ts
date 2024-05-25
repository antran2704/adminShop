import qs from "qs";
import { uploadImageOnServer } from "~/helper/handleImage";
import { IBlog, ICreateBlog, IFilter, IQueryParam } from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";

const getBlogs = async (page: number = 1) => {
  return await axiosGet(`/admin/blogs?page=${page}`);
};

const getBlog = async (blog_id: string) => {
  return await axiosGet(`/admin/blogs/id/${blog_id}`);
};

const getBlogsWithFilter = async (
  filter: IFilter | null,
  query?: IQueryParam<Partial<IBlog>>,
  page: number = 1
) => {
  const parseQuery = qs.stringify(query);
  return await axiosGet(
    `/admin/blogs/search?search=${filter?.search || ""}${
      parseQuery && "&" + parseQuery
    }&page=${page}`
  );
};

const createBlog = async (payload: ICreateBlog) => {
  return await axiosPost("/admin/blogs", payload);
};

const updateBlog = async (blog_id: string, options?: Partial<ICreateBlog>) => {
  return await axiosPatch(`/admin/blogs/${blog_id}`, {
    ...options,
  });
};

const uploadBlogImage = async (formData: FormData) => {
  return await uploadImageOnServer(
    `${process.env.NEXT_PUBLIC_ENDPOINT_API}/admin/blogs/uploadImage`,
    formData
  );
};

const deleteBlog = async (blog_id: string) => {
  return await axiosDelete(`/admin/blogs/${blog_id}`);
};

export {
  getBlogs,
  getBlog,
  getBlogsWithFilter,
  updateBlog,
  uploadBlogImage,
  deleteBlog,
  createBlog,
};

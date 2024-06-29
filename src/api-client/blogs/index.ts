import qs from "qs";
import { uploadImageOnServer } from "~/helper/handleImage";
import { IBlog, ICreateBlog, IFilter, IQueryParam } from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getBlogs = async (page: number = 1) => {
  return await axiosGet(BASE_URL + `/admin/blogs?page=${page}`);
};

const getBlog = async (blog_id: string) => {
  return await axiosGet(BASE_URL + `/admin/blogs/id/${blog_id}`);
};

const getBlogsWithFilter = async (
  filter: IFilter | null,
  query?: IQueryParam<Partial<IBlog>>,
  page: number = 1
) => {
  const parseQuery = qs.stringify(query);
  return await axiosGet(
    BASE_URL + `/admin/blogs/search?search=${filter?.search || ""}${
      parseQuery && "&" + parseQuery
    }&page=${page}`
  );
};

const createBlog = async (payload: ICreateBlog) => {
  return await axiosPost(BASE_URL + "/admin/blogs", payload);
};

const updateBlog = async (blog_id: string, options?: Partial<ICreateBlog>) => {
  return await axiosPatch(BASE_URL + `/admin/blogs/${blog_id}`, {
    ...options,
  });
};

const uploadBlogImage = async (formData: FormData) => {
  return await uploadImageOnServer(
    BASE_URL + `${process.env.NEXT_PUBLIC_ENDPOINT_API}/admin/blogs/uploadImage`,
    formData
  );
};

const deleteBlog = async (blog_id: string) => {
  return await axiosDelete(BASE_URL + `/admin/blogs/${blog_id}`);
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

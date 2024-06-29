import { axiosGet, axiosPost } from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getUser = async () => {
  return await axiosGet(BASE_URL + "/admin");
};

const logout = async () => {
  return await axiosPost(BASE_URL + "/admin/logout");
};

const login = async (email: string, password: string) => {
  return await axiosPost(BASE_URL + "/admin/login", { email, password });
};

const getRefreshToken = async () => {
  return await axiosGet(BASE_URL + "/admin/refreshToken");
};

const getPermission = async (userId: string) => {
  return await axiosGet(BASE_URL + `/admin/permission/${userId}`);
};

export { getRefreshToken, getUser, logout, login, getPermission };

import httpConfig, { axiosGet, axiosPost } from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getInfoUser = async () => {
  return await httpConfig.get(BASE_URL + "/admin").then((res) => res.data);
};

const logout = async () => {
  return await axiosPost(BASE_URL + "/admin/logout");
};

const login = async (body: { email: string; password: string }) => {
  return await httpConfig
    .post(BASE_URL + "/admin/login", body)
    .then((res) => res.data);
};

const getRefreshToken = async (refreshToken: string) => {
  return await httpConfig
    .post(BASE_URL + "/admin/refreshToken", {
      refreshToken,
    })
    .then((res) => res.data);
};

const getPermission = async (userId: string) => {
  return await axiosGet(BASE_URL + `/admin/permission/${userId}`);
};

export { getRefreshToken, getInfoUser, logout, login, getPermission };

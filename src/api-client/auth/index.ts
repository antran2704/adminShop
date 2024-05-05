import { axiosGet, axiosPost } from "~/ultils/configAxios";

const getUser = async () => {
  return await axiosGet("/admin");
};

const logout = async () => {
  return await axiosPost("/admin/logout", {});
};

const getRefreshToken = async () => {
  return await axiosGet("/admin/refreshToken");
};

const getPermission = async (userId: string) => {
  return await axiosGet(`/admin/permission/${userId}`);
};

export { getRefreshToken, getUser, logout, getPermission };

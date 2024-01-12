import { axiosGet, axiosPost } from "~/ultils/configAxios";

const getUser = async () => {
  return await axiosGet("/admin");
};

const logout = async () => {
  return await axiosPost("/admin/logout", {});
}

const getRefreshToken = async () => {
  return await axiosGet("/admin/refreshToken");
};

export { getRefreshToken, getUser, logout };

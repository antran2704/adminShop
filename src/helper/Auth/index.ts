import { axiosGet, axiosPost } from "~/ultils/configAxios";

const handleGetUser = async (accessToken: string, publicKey: string) => {
  const headers = {
    Authorization: `Bear ${accessToken}`,
    "public-key": `Key ${publicKey}`,
  };
  return await axiosGet("/admin", { headers });
};

const getRefreshToken = async (refreshToken: string) => {
  return await axiosPost("/admin/refreshToken", {
    refreshToken,
  });
};

export { handleGetUser, getRefreshToken };

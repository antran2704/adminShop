import { axiosGet, axiosPost } from "~/ultils/configAxios";

const handleGetUser = async (accessToken: string, publicKey: string) => {
  const headers = {
    Authorization: `Bear ${accessToken}`,
    "public-key": `Key ${publicKey}`,
  };
  const payload = await axiosGet("/admin", { headers });
  return payload;
};

const getRefreshToken = async (refreshToken: string) => {
  const payload = await axiosPost("/admin/refreshToken", {
    refreshToken,
  });

  return payload;
};

export { handleGetUser, getRefreshToken };

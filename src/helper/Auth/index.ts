import { axiosGet, axiosPost } from "~/ultils/configAxios";

const handleGetUser = async (accessToken: string, publicKey: string) => {
  if (!accessToken || !publicKey) return;

  const headers = {
    Authorization: `Bear ${accessToken}`,
    "public-key": `Key ${publicKey}`,
  };
  const payload = await axiosGet("/users", { headers });
  return payload;
};

const getRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) return null;

  const payload = await axiosPost("/users/refreshToken", {
    refreshToken,
  });

  return payload;
};

export { handleGetUser, getRefreshToken };

import axios, { AxiosRequestConfig } from "axios";
import { getCookies, setCookie } from "cookies-next";
import { getRefreshToken } from "~/helper/Auth";

const httpConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT_API,
});

const axiosGet = async (
  path: string,
  config?: AxiosRequestConfig | undefined
) => {
  const payload = await httpConfig.get(path, { ...config });
  return payload.data;
};

const axiosPost = async <T>(
  path: string,
  data: T,
  config?: AxiosRequestConfig | undefined
) => {
  const payload = await httpConfig.post(path, data, { ...config });
  return payload.data;
};

const axiosPatch = async <T>(
  path: string,
  data: T,
  config?: AxiosRequestConfig | undefined
) => {
  const payload = await httpConfig.patch(path, data, { ...config });
  return payload.data;
};

const axiosDelete = async (
  path: string,
  config?: AxiosRequestConfig | undefined
) => {
  const payload = await httpConfig.delete(path, { ...config });
  return payload.data;
};

httpConfig.interceptors.response.use(
  function (response) {
    return response;
  },
  async (error) => {
    const { refreshToken } = getCookies();
    if (!refreshToken) return Promise.reject(error);

    const response = error.response.data;

    if (
      response.status === 400 &&
      (response.message === "invalid signature" ||
        response.message === "jwt malformed")
    ) {
      const { status, payload } = await getRefreshToken(refreshToken);

      if (status === 200) {
        setCookie("accessToken", payload.newAccessToken);
      }
    }

    return Promise.reject(error);
  }
);

export { axiosGet, axiosPatch, axiosPost, axiosDelete };

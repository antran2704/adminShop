import axios, { AxiosRequestConfig } from "axios";
import { deleteCookie, getCookies, setCookie } from "cookies-next";
import { toast } from "react-toastify";
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

let isRefresh = false;

httpConfig.interceptors.response.use(
  function (response) {
    return response;
  },
  async (error) => {
    console.log(error);
    const response = error.response.data;

    if (error.code === "ERR_NETWORK") {
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return Promise.reject(error);
    }

    if (response.status === 500) {
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return Promise.reject(error);
    }

    if (
      response.status === 400 &&
      (response.message === "jwt expired" ||
        response.message === "jwt malformed")
    ) {
      const { refreshToken } = getCookies();
      if (!refreshToken) return Promise.reject(error);

      if (!isRefresh) {
        isRefresh = true;

        const { status, payload } = await getRefreshToken(refreshToken);
        if (status === 200) {
          setCookie("accessToken", payload.newAccessToken);
          isRefresh = false;
        }
      } else {
        deleteCookie("accessToken");
        deleteCookie("publicKey");
        deleteCookie("refreshToken");
        deleteCookie("apiKey");
        isRefresh = false;
      }
    }

    return Promise.reject(error);
  }
);

export { axiosGet, axiosPatch, axiosPost, axiosDelete };

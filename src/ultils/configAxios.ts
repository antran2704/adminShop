import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { getRefreshToken, logout } from "~/api-client";

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

const handleLogout = () => {
  logout();
  // window.location.pathname = "/login";
};

httpConfig.interceptors.response.use(
  function (response) {
    return response;
  },
  async (error) => {
    if (error.code === "ERR_NETWORK") {
      toast.error("Please check your network", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return Promise.reject(error);
    }

    const response = error.response.data;

    if (!response) return Promise.reject(error);

    if (response.status === 500) {
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return Promise.reject(error);
    }

    if (response.status === 403) {
      toast.error("Forbidden, please login", {
        position: toast.POSITION.TOP_RIGHT,
      });
      handleLogout();
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (response.status === 401) {
      if (!isRefresh && !originalRequest._retry) {
        isRefresh = true;

        const { status } = await getRefreshToken();
        if (status === 200) {
          isRefresh = false;

          originalRequest._retry = true;
          return Promise.resolve(httpConfig(originalRequest));
        }
      } else {
        handleLogout();
        isRefresh = false;
      }
    }

    return Promise.reject(error);
  }
);

export { axiosGet, axiosPatch, axiosPost, axiosDelete };

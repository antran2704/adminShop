import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { getRefreshToken } from "~/api-client";
import { loginReducer } from "~/store/slice/user";
import { AppDispatch } from "~/store";
import { NextRouter } from "next/router";
import { clearCookieAuth } from "~/helper/cookie";

const httpConfig = axios.create({
  timeout: 30000,
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
  data?: T,
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
let router: NextRouter;
let dispatch: AppDispatch;

export const injectStore = (_dispatch: AppDispatch) => {
  dispatch = _dispatch;
};

export const injectRouter = (_router: NextRouter) => {
  router = _router;
};

const URL_SKIP: string[] = ["/login"];

const handleLogout = () => {
  const userInfor = {
    _id: null,
    name: "",
    email: "",
    avartar: null,
  };

  dispatch(loginReducer(userInfor));
  clearCookieAuth();
  router.push("/login");
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

    if (!error.response.data) return Promise.reject(error);

    const response = error.response.data;

    if (response.status === 500) {
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });

      return Promise.reject(error);
    }

    if (response.status === 403) {
      router.push("/");
      return Promise.reject(error);
    }

    if (response.status === 404 && response.message === "Not found key token") {
      handleLogout();
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const url: string = originalRequest.url;

    if (URL_SKIP.includes(url)) {
      return Promise.reject(error);
    }

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

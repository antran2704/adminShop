import axios, { AxiosRequestConfig } from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";

import { getRefreshToken } from "~/api-client";
import { logoutReducer } from "~/store/slice/user";
import { AppDispatch } from "~/store";
import { NextRouter } from "next/router";
import { clearAuthLocal, getAuthLocal, setAuthLocal } from "~/helper/auth";
import MESSAGE_ERROR from "~/common/message/error";
import { message } from "antd";

const httpConfig = axios.create({
  timeout: 30000,
});

const axiosGet = async (
  path: string,
  config?: AxiosRequestConfig | undefined,
) => {
  const payload = await httpConfig.get(path, { ...config });
  return payload.data;
};

const axiosPost = async <T>(
  path: string,
  data?: T,
  config?: AxiosRequestConfig | undefined,
) => {
  const payload = await httpConfig.post(path, data, { ...config });
  return payload.data;
};

const axiosPatch = async <T>(
  path: string,
  data: T,
  config?: AxiosRequestConfig | undefined,
) => {
  const payload = await httpConfig.patch(path, data, { ...config });
  return payload.data;
};

const axiosDelete = async (
  path: string,
  config?: AxiosRequestConfig | undefined,
) => {
  const payload = await httpConfig.delete(path, { ...config });
  return payload.data;
};

let isRefresh = false;
let translate: any;
let router: NextRouter;
let dispatch: AppDispatch;

export const injectTranlate = (_translate: any) => {
  translate = _translate;
};

export const injectStore = (_dispatch: AppDispatch) => {
  dispatch = _dispatch;
};

export const injectRouter = (_router: NextRouter) => {
  router = _router;
};

const SKIP_URL: string[] = [
  process.env.NEXT_PUBLIC_ENDPOINT_API + "/admin/login",
];

const handleLogout = async () => {
  clearAuthLocal();
  dispatch(logoutReducer());
  await router.push("/login");
};

httpConfig.interceptors.request.use(
  async (config) => {
    const accessToken = getAuthLocal("accessToken") as string;
    const refreshToken = getAuthLocal("refreshToken") as string;
    const publicToken = getAuthLocal("publicKey") as string;
    const apiKeyToken = getAuthLocal("apiKey") as string;

    /**
     *  get uri of url request
     *  expample: internal/user/login
     **/
    const url: string = config.url as string;

    // controller for cancle request to server if refreshToken expried
    const controller = new AbortController();

    // check accesstoken already have on browser
    if (accessToken && publicToken) {
      const decoded: JwtPayload = jwt.decode(accessToken) as JwtPayload;
      if (!decoded) {
        await router.push("/login");

        controller.abort();
        return {
          ...config,
          signal: controller.signal,
        };
      }

      const accessTokenExp: number = decoded?.exp as number;
      const currentTime: number = Math.floor(new Date().getTime() / 1000) + 60;

      // check accessToken still live or was expried
      if (currentTime >= accessTokenExp && !isRefresh) {
        isRefresh = true;
        try {
          const { status, payload } = await getRefreshToken(refreshToken);

          if (status === 200) {
            setAuthLocal("accessToken", payload.newAccessToken);

            // Retry the original request with the new token
            config.headers.Authorization = `Bearer ${payload.newAccessToken}`;
            config.headers["Public-Key"] = publicToken;
            config.headers["X-Api-Key"] = apiKeyToken;
            isRefresh = false;
            return config;
          }
        } catch (error) {
          isRefresh = false;
          controller.abort();

          return {
            ...config,
            signal: controller.signal,
          };
        }
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers["Public-Key"] = publicToken;
      config.headers["X-Api-Key"] = apiKeyToken;
    }
    if (SKIP_URL.includes(url)) return config;

    if (
      (!accessToken || !refreshToken || !publicToken) &&
      !SKIP_URL.includes(url)
    ) {
      handleLogout();
      controller.abort();

      return {
        ...config,
        signal: controller.signal,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
httpConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it

    if (!error.response) {
      return Promise.reject(error);
    }

    // if (
    //   error.response.status === 401 &&
    //   error.response.data.message === MESSAGE_ERROR.UNAUTHORIZED &&
    //   isRefresh
    // ) {
    //   isRefresh = false;
    //   handleLogout();
    // }

    if (
      error.response.status === 401 &&
      error.response.data.message === MESSAGE_ERROR.JWT_EXPRIED
    ) {
      isRefresh = false;
      message.info(translate("Error.SESSION_EXPRIED"));
      handleLogout();
    }

    return Promise.reject(error);
  },
);

export default httpConfig;
export { axiosGet, axiosPatch, axiosPost, axiosDelete };

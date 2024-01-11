import { deleteCookie, setCookie } from "cookies-next";
import { IKeyToken } from "~/interface";

const logout = () => {
  deleteCookie("accessToken");
  deleteCookie("publicKey");
  deleteCookie("refreshToken");
  deleteCookie("apiKey");
};

const login = (data: IKeyToken) => {
  setCookie("accessToken", data.accessToken);
  setCookie("publicKey", data.publicKey);
  setCookie("refreshToken", data.refreshToken);
  setCookie("apiKey", data.apiKey);
};

export { logout, login };

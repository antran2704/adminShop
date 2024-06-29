import { getCookies, deleteCookie } from "cookies-next";

const checkCookieAuth = (): boolean => {
  const { accessToken, refreshToken, publicKey, apiKey } = getCookies();

  return !!accessToken && !!refreshToken && !!publicKey && !!apiKey;
};

const clearCookieAuth = (): void => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  deleteCookie("publicKey");
  deleteCookie("apiKey");
};

export { checkCookieAuth, clearCookieAuth };

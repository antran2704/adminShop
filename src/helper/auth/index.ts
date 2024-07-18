import { IAuthLocal } from "~/interface";

const checkPermission = (
  permissions: string[],
  permission: string,
): boolean => {
  if (!permissions.includes(permission)) return false;

  return true;
};

const setAuthLocal = (key: keyof IAuthLocal, value: string): void => {
  localStorage.setItem(key, value);
};

const checkAuthLocal = (): boolean => {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const refreshToken: string | null = localStorage.getItem("refreshToken");
  const apiKey: string | null = localStorage.getItem("apiKey");
  const publicKey: string | null = localStorage.getItem("publicKey");

  return !!accessToken && !!refreshToken && !!apiKey && !!publicKey;
};

const getAuthLocal = (key: keyof IAuthLocal) => {
  const value: string | null = localStorage.getItem(key);
  return value;
};

const clearAuthLocal = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("apiKey");
  localStorage.removeItem("publicKey");
};

export {
  checkPermission,
  setAuthLocal,
  checkAuthLocal,
  getAuthLocal,
  clearAuthLocal,
};

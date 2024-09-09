import httpConfig from "~/configs/configAxios";
import { IChangePassword, IUpdateAccount } from "~/interface";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getAccount = async () => {
  return await httpConfig.get(BASE_URL + "/admin").then((res) => res.data);
};

const updateAccount = async (id: string, data: IUpdateAccount) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/${id}`, data)
    .then((res) => res.data);
};

const uploadAvartar = async (formData: FormData) => {
  return await httpConfig
    .post(BASE_URL + `/admin/avartar`, formData)
    .then((res) => res.data);
};

const changePasswordAccount = async (
  data: Omit<IChangePassword, "reNewPassword">,
) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/changePassword`, data)
    .then((res) => res.data);
};

export { getAccount, updateAccount, uploadAvartar, changePasswordAccount };

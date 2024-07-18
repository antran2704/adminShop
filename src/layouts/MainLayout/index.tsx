import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { loginReducer, setPermisson } from "~/store/slice/user";

import { getPermission, getInfoUser } from "~/api-client";

import { injectStore } from "~/configs/configAxios";
import { checkDarkMode } from "~/helper/darkMode";
import SpinLoading from "~/components/Loading/SpinLoading";
import { IResponse, IUserInfor } from "~/interface";

interface Props {
  children: JSX.Element;
}

const MainLayout = ({ children }: Props) => {
  const router = useRouter();

  const { infor } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);

  const handleGetPermission = async (userId: string) => {
    if (!userId) return;

    try {
      const { status, payload } = await getPermission(userId);

      if (status === 200) {
        dispatch(setPermisson(payload));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAuth = async () => {
    setLoading(true);

    try {
      const { status, payload }: IResponse<IUserInfor> = await getInfoUser();

      if (status === 200) {
        dispatch(loginReducer(payload));
      }
    } catch (err) {
      router.push("/login");
    }

    setLoading(false);
  };

  useEffect(() => {
    // init store of redux for axios
    injectStore(dispatch);
    checkDarkMode(dispatch);
    checkAuth();
  }, []);

  useEffect(() => {
    if (!infor._id) return;

    handleGetPermission(infor._id);
  }, [infor]);

  if (loading) {
    return <SpinLoading className="text-3xl" />;
  }

  return children;
};

export default MainLayout;

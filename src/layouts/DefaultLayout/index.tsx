import { useRouter } from "next/router";
import { useState, useEffect, FC } from "react";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { loginReducer, setPermisson } from "~/store/slice/user";

import Loading from "~/components/Loading";
import { getPermission, getUser } from "~/api-client";
import { injectStore } from "~/ultils/configAxios";
import { checkDarkMode } from "~/helper/darkMode";

interface Props {
  children: JSX.Element;
}

const DefaultLayout: FC<Props> = ({ children }: Props) => {
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
      const { status, payload } = await getUser();

      if (status === 200) {
        dispatch(loginReducer(payload));
        setLoading(false);
      }
    } catch (err) {
      router.push("/login");
    }
  };

  useEffect(() => {
    injectStore(dispatch);

    if (!infor._id) {
      checkAuth();
      return;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkDarkMode(dispatch);
  }, []);

  useEffect(() => {
    if (!infor._id) return;

    handleGetPermission(infor._id);
  }, [infor]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex items-start justify-between bg-[#f9fafb] dark:bg-[#111827] transition-all ease-linear duration-100">
      {children}
    </main>
  );
};

export default DefaultLayout;

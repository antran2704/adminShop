import { useRouter } from "next/router";
import { useState, useEffect, FC } from "react";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { loginReducer } from "~/store/slice/user";

import Navbar from "~/components/Navbar";
import Loading from "~/components/Loading";
import { getUser } from "~/api-client";
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

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex items-start justify-between bg-[#f9fafb] dark:bg-[#111827] transition-all ease-linear duration-100">
      <Navbar />
      <div className="w-full min-h-screen">
        {children}
      </div>
    </main>
  );
};

export default DefaultLayout;

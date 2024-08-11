import { useRouter } from "next/router";
import { useEffect } from "react";
import { getInfoUser } from "~/api-client";
import DarkMode from "~/components/DarkMode";
import Translation from "~/components/Translation";
import { checkDarkMode } from "~/helper/darkMode";
import { IResponse, IUserInfor } from "~/interface";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { loginReducer } from "~/store/slice/user";

interface Props {
  children: JSX.Element;
}

const PublicLayout = ({ children }: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { infor } = useAppSelector((state) => state.user);

  const checkAuth = async () => {
    try {
      const { status, payload }: IResponse<IUserInfor> = await getInfoUser();

      if (status === 200) {
        dispatch(loginReducer(payload));
        router.push("/");
      }
    } catch (err) {
      // await router.push("/login");
    }
  };

  useEffect(() => {
    if (!infor._id) {
      checkAuth();
    }
  }, [infor._id]);

  useEffect(() => {
    checkDarkMode(dispatch);
  }, []);

  useEffect(() => {
    if (infor._id) {
      router.push("/");
    }
  }, [infor]);

  return (
    <main className="bg_login relative flex items-center justify-center h-screen">
      <div className="fixed top-5 right-5">
        <Translation />
      </div>

      {children}

      <div className="fixed bottom-5 right-5 rounded-full dark:bg-darkInput bg-white transition-all ease-linear duration-100">
        <DarkMode />
      </div>
    </main>
  );
};

export default PublicLayout;

import { useRouter } from "next/router";
import { useState, useEffect, createContext, FC, Fragment } from "react";
import { getCookies, setCookie, deleteCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch } from "~/store/hooks";
import { login } from "~/store/slice";

import Navbar from "~/components/Navbar";
import Loading from "~/components/Loading";
import { getRefreshToken, handleGetUser } from "~/helper/Auth";
import { AxiosError } from "axios";
import { AxiosResponseCus } from "~/interface";

export interface IAuthContext {
  handleLogOut: () => void;
}

export const AuthContex = createContext<IAuthContext>({
  handleLogOut: (): void => {},
});

interface Props {
  children: JSX.Element;
}

const DefaultLayout: FC<Props> = ({ children }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const handleRefreshToken: () => Promise<any> = async () => {
    const { refreshToken } = getCookies();

    if (!refreshToken) {
      router.push("/login");
      return;
    }

    const { status, payload } = await getRefreshToken(refreshToken);

    if (status === 200) {
      setCookie("accessToken", payload.newAccessToken);
    }

    return { status, payload };
  };

  const handleCheckLogin = async () => {
    const { accessToken, publicKey } = getCookies();

    if (!accessToken || !publicKey) return null;

    const { status, payload } = await handleGetUser(accessToken, publicKey);
    return { status, payload };
  };

  const checkAuth = async () => {
    setLoading(true);
    const { refreshToken, publicKey } = getCookies();

    if (!refreshToken || !publicKey) {
      router.push("/login");
      return;
    }

    try {
      const { accessToken } = getCookies();

      if (!accessToken) {
        await handleRefreshToken();
      }

      const response = await handleCheckLogin();

      // if(!response) {
      //   await handleRefreshToken();
      // }

      if (response && response.status === 200) {
        dispatch(login(response.payload));
      }
    } catch (err) {
      const error = err as AxiosError;
      const { status, data } = error.response as AxiosResponseCus;
      if (status === 400 && data.message === "jwt expired") {
        const { refreshToken } = getCookies();
        if (!refreshToken) {
          router.push("/login");
          return;
        }

        await handleCheckLogin();
      }
    }

    setLoading(false);
  };

  const handleLogOut = () => {
    setLoading(true);

    deleteCookie("accessToken");
    deleteCookie("publicKey");
    deleteCookie("refreshToken");
    deleteCookie("apiKey");

    const userInfor = {
      _id: null,
      name: "",
      email: "",
      avartar: null,
    };
    dispatch(login(userInfor));
    router.push("/login");

    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex items-start justify-between bg-[#f9fafb]">
      <AuthContex.Provider
        value={{
          handleLogOut,
        }}
      >
        <Navbar />
        <div className="w-full min-h-screen">{children}</div>
      </AuthContex.Provider>
      <ToastContainer
        autoClose={5000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </main>
  );
};

export default DefaultLayout;

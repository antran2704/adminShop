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
  handleCheckLogin: () => Promise<AxiosResponseCus | undefined>;
  handleRefreshToken: () => Promise<AxiosResponseCus | undefined>;
  checkAuth: () => Promise<AxiosResponseCus | undefined>;
  handleLogOut: () => void;
}

export const AuthContex = createContext<IAuthContext>({
  handleCheckLogin: function (): Promise<AxiosResponseCus | undefined> {
    throw new Error("Function not implemented.");
  },
  handleRefreshToken: function (): Promise<AxiosResponseCus | undefined> {
    throw new Error("Function not implemented.");
  },
  checkAuth: function (): Promise<AxiosResponseCus | undefined> {
    throw new Error("Function not implemented.");
  },
  handleLogOut: () => {},
});

interface Props {
  children: JSX.Element;
}

const DefaultLayout: FC<Props> = ({ children }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const handleRefreshToken: () => Promise<
    AxiosResponseCus | undefined
  > = async () => {
    const { refreshToken } = getCookies();

    if (!refreshToken) {
      router.push("/login");
      return;
    }

    try {
      const { status, payload } = await getRefreshToken(refreshToken);

      if (status === 200) {
        setCookie("accessToken", payload.newAccessToken);
        return { status, data: payload };
      }
    } catch (err) {
      const { code, response } = err as AxiosError;
      if (code === "ERR_NETWORK") {
        return { status: 500, data: { message: "Error in server" } };
      }

      const { status, data } = response as unknown as AxiosResponseCus;
      if (data.message === "jwt expired" || data.message === "jwt malformed") {
        router.push("/login");
      }

      return { status, data };
    }
  };

  const handleCheckLogin = async () => {
    const { accessToken, refreshToken, publicKey } = getCookies();

    if (!accessToken || !refreshToken || !publicKey) {
      return { status: 401, data: { message: "Unauthor" } };
    }

    try {
      const { status, payload } = await handleGetUser(accessToken, publicKey);

      if (status === 200) {
        dispatch(login(payload));

        return { status, data: payload };
      }
    } catch (err) {
      const { code, response } = err as AxiosError;
      if (code === "ERR_NETWORK") {
        return { status: 500, data: { message: "Error in server" } };
      }

      if (response) {
        const { status, data } = response;
        return { status, data };
      }
    }
  };

  const checkAuth = async () => {
    setLoading(true);

    const { status, data } = (await handleCheckLogin()) as AxiosResponseCus;

    switch (status) {
      case 400:
        if (
          data.message === "invalid signature" ||
          data.message === "jwt malformed"
        ) {
          router.push("/login");
        }

        if (data.message === "jwt expired") {
          const responseRefresh =
            (await handleRefreshToken()) as AxiosResponseCus;

          if (responseRefresh.status === 200) {
            const { status, data } =
              (await handleCheckLogin()) as AxiosResponseCus;

            // setLoading(false);
            return { status, data };
          }
        }
        break;

      case 401:
        router.push("/login");
        return;

      case 500:
        toast.error("Server is busy, please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
    }

    setLoading(false);
    return { status, data };
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
          handleCheckLogin,
          handleRefreshToken,
          checkAuth,
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

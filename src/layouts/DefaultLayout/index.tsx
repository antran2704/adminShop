import { useRouter } from "next/router";
import { useState, useEffect, createContext, FC } from "react";
import { getCookies, setCookie } from "cookies-next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch } from "~/store/hooks";
import { loginReducer } from "~/store/slice";

import Navbar from "~/components/Navbar";
import Loading from "~/components/Loading";
import { logout } from "~/helper/Auth";
import { getRefreshToken, getUser } from "~/api-client";

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

    const { status, payload } = await getUser(accessToken, publicKey);

    if (status === 200) {
      dispatch(loginReducer(payload));
    }

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

      await handleCheckLogin();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleLogOut = () => {
    setLoading(true);

    logout();

    const userInfor = {
      _id: null,
      name: "",
      email: "",
      avartar: null,
    };
    dispatch(loginReducer(userInfor));
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

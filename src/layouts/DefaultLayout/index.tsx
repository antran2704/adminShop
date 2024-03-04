import { useRouter } from "next/router";
import { useState, useEffect, FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { loginReducer } from "~/store/slice";

import Navbar from "~/components/Navbar";
import Loading from "~/components/Loading";
import { getUser } from "~/api-client";
import { injectStore } from "~/ultils/configAxios";
// import { socket } from "~/ultils/socket";

interface Props {
  children: JSX.Element;
}

const DefaultLayout: FC<Props> = ({ children }: Props) => {
  const router = useRouter();

  const { infor } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [notifications, setNotifications] = useState<string[]>([]);
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

  const onNotification = (value: string) => {
    setNotifications([...notifications, value]);
  };

  useEffect(() => {
    injectStore(dispatch);

    if (!infor._id) {
      checkAuth();
      return;
    }
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   socket.connect();

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   socket.on("notification", onNotification);

  //   return () => {
  //     socket.off("notification", onNotification);
  //   };
  // }, [notifications]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex items-start justify-between bg-[#f9fafb]">
      <Navbar />
      <div className="w-full min-h-screen">
        {/* <div className="flex flex-col items-end p-5">
          <p>Notification</p>
          <ul>
            {notifications.map((notification: string, index: number) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </div> */}
        {children}
      </div>
      <ToastContainer
        autoClose={5000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </main>
  );
};

export default DefaultLayout;

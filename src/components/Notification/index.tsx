import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { getNotifications, updateNotification } from "~/api-client";
import { Notification, NotificationItem } from "~/interface";
import ImageCus from "../Image/ImageCus";
import { getDateTime } from "~/helper/datetime";
import { iconNoti, styleTypeNoti } from "./data";
import { useRouter } from "next/router";
import { Socket, io } from "socket.io-client";
import { NotitficationType } from "~/enums";

const initNotification: Notification = {
  notifications: [],
  total: 0,
  totalUnread: 0,
};
const Notification = () => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [notification, setNotification] =
    useState<Notification>(initNotification);

  const onShowModal = () => {
    setShowModal(!showModal);
  };

  const onNotification = (item: NotificationItem) => {
    const newNotifications = notification.notifications;
    newNotifications.pop();
    newNotifications.unshift(item);
    setNotification({
      ...notification,
      notifications: newNotifications,
      totalUnread: notification.totalUnread + 1,
    });
  };

  const onClickNoti = async (data: NotificationItem) => {
    if (data.isReaded) {
      if (data.path) {
        if (data.type === NotitficationType.product) {
          router.push(`/edit/${data.path.replace("products", "product")}`);
        } else {
          router.push(data.path);
        }
      }

      return;
    }

    try {
      const { status } = await updateNotification(data._id, { isReaded: true });

      if (status === 201) {
        const notifications: NotificationItem[] =
          notification.notifications.map((item: NotificationItem) => {
            if (item._id === data._id) {
              item.isReaded = true;
            }

            return item;
          });

        setNotification({
          ...notification,
          notifications,
          totalUnread: notification.totalUnread - 1,
        });

        if (data.path) {
          if (data.type === NotitficationType.product) {
            router.push(`/edit/${data.path.replace("products", "product")}`);
          } else {
            router.push(data.path);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetNotifications = async () => {
    try {
      const { status, payload } = await getNotifications();

      if (status === 200) {
        setNotification(payload);
        console.log(payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const URL = process.env.SOCKET_ENDPOINT || "http://localhost:3001";
    const socketInit = io(URL);
    socketInit.connect();
    console.log("notifi");

    setSocket(socketInit);
    handleGetNotifications();

    return () => {
      socketInit.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("notification", onNotification);
    }

    return () => {
      if (socket) {
        socket.off("notification", onNotification);
      }
    };
  }, [socket, notification]);

  return (
    <div
      onMouseLeave={() => {
        if (showModal) {
          onShowModal();
        }
      }}
      className="sticky top-0 flex flex-col items-end bg-white px-5 py-2 border-b shadow z-30"
    >
      <div className={`relative`}>
        <div
          onClick={onShowModal}
          className={`relative flex items-center justify-center p-2 ${
            showModal ? "bg-slate-200" : "bg-slate-100 hover:bg-slate-200"
          } rounded-full cursor-pointer`}
        >
          <FaRegBell className="text-2xl" />
          {notification.totalUnread > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white text-xs bg-primary rounded-full z-0">
              {notification.totalUnread > 99 ? "99" : notification.totalUnread}
            </span>
          )}
        </div>

        <ul
          className={`absolute ${
            showModal
              ? "top-full pointer-events-auto opacity-100"
              : "top-[120%] opacity-0 pointer-events-none"
          } right-0 bg-white shadow-lg rounded-md border transition-all ease-linear duration-100 overflow-hidden z-10`}
        >
          {notification.notifications.map(
            (item: NotificationItem, index: number) => (
              <li
                key={item._id}
                onClick={() => onClickNoti(item)}
                className={`flex items-center px-5 py-2 hover:bg-slate-100 ${
                  index > 0 ? "border-t" : ""
                } cursor-pointer gap-5`}
              >
                <ImageCus
                  src={iconNoti[item.type]}
                  className="min-w-[32px] min-h-[32px] w-8 h-8 rounded-full"
                />
                <div className="w-full flex items-center justify-between gap-5">
                  <div className="w-full">
                    <p
                      className={`lg:max-w-[600px] md:max-w-[500px] sm:max-w-[400px] max-w-[200px] w-[500px] text-start text-sm ${
                        !item.isReaded ? "font-medium" : "font-normal"
                      } line-clamp-2`}
                    >
                      {item.content}
                    </p>
                    <div className="flex items-center pt-2 gap-2">
                      <p
                        className={`text-white text-start whitespace-nowrap text-xs capitalize px-2 py-1 rounded-full ${
                          styleTypeNoti[item.type]
                        }`}
                      >
                        {item.type}
                      </p>
                      <p className="text-start whitespace-nowrap text-xs">
                        {getDateTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  {!item.isReaded && (
                    <span className="block w-2 h-2 rounded-full bg-primary"></span>
                  )}
                </div>
              </li>
            )
          )}
          {notification.total > 5 && (
            <button className="w-full text-center text-base hover:text-primary hover:bg-slate-100 px-5 py-2 border-t">
              Xem thêm
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;

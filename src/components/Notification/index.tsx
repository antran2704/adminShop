import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";

import { getNotifications, updateNotification } from "~/api-client";
import { INotification, INotificationItem } from "~/interface";
import { useRouter } from "next/router";
import { Socket, io } from "socket.io-client";
import { NotitficationType } from "~/enums";
import Link from "next/link";
import NotificationItem from "./NotificationItem";

const initNotification: INotification = {
  notifications: [],
  total: 0,
  totalUnread: 0,
};

let timmerRing: NodeJS.Timeout;

const Notification = () => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ring, setRing] = useState<boolean>(false);

  const [notification, setNotification] =
    useState<INotification>(initNotification);

  const onShowModal = () => {
    setShowModal(!showModal);
  };

  const onNotification = (item: INotificationItem) => {
    if (timmerRing) {
      clearTimeout(timmerRing);
    }

    setRing(true);

    const newNotifications = notification.notifications;
    newNotifications.pop();
    newNotifications.unshift(item);
    setNotification({
      ...notification,
      notifications: newNotifications,
      totalUnread: notification.totalUnread + 1,
    });

    timmerRing = setTimeout(() => {
      setRing(false);
    }, 400);
  };

  const onClickNoti = async (data: INotificationItem) => {
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
        const notifications: INotificationItem[] =
          notification.notifications.map((item: INotificationItem) => {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const URL = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT as string;
    const socketInit = io(URL);
    socketInit.connect();

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
      className="flex items-center gap-2"
    >
      <div className="relative">
        <div
          onClick={onShowModal}
          className={`relative flex items-center justify-center p-2 ${
            showModal
              ? "bg-slate-200"
              : "bg-slate-100 dark:bg-transparent hover:bg-slate-200"
          } ${
            ring ? "bg-blue-600 hover:bg-blue-400" : ""
          } rounded-full cursor-pointer ease-linear duration-100`}
        >
          <FaRegBell
            className={`${ring ? "animate_ring-bell text-white" : ""} ${
              showModal ? "dark:text-black" : "dark:text-white"
            } text-2xl ease-linear duration-100`}
          />

          {notification.totalUnread > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white text-xs bg-primary rounded-full z-0">
              {notification.totalUnread > 99 ? "99" : notification.totalUnread}
            </span>
          )}
        </div>
        <ul
          className={`scroll absolute ${
            showModal
              ? "top-full pointer-events-auto opacity-100"
              : "top-[120%] opacity-0 pointer-events-none"
          } right-0 max-h-[600px] bg-white shadow-lg rounded-md border transition-all ease-linear duration-100 overflow-auto z-10`}
        >
          {notification.notifications.map(
            (item: INotificationItem, index: number) => (
              <li
                key={item._id}
                onClick={() => onClickNoti(item)}
                className={`hover:bg-slate-100 border-b last:border-none`}
              >
                <NotificationItem data={item} onClick={onClickNoti} />
              </li>
            )
          )}
          {notification.total > notification.notifications.length && (
            <Link
              href="/notifications"
              className="block w-full text-center text-base hover:text-primary hover:bg-slate-100 px-5 py-2 border-t"
            >
              Xem thêm
            </Link>
          )}
          {!notification.notifications.length && (
            <li
              className={`flex items-center px-5 py-2 whitespace-nowrap gap-5`}
            >
              No notification
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;

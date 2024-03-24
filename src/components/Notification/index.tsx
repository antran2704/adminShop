import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { getNotifications, updateNotification } from "~/api-client";
import { Notification, NotificationItem } from "~/interface";
import { socket } from "~/ultils/socket";
import ImageCus from "../Image/ImageCus";
import { getDateTime } from "~/helper/datetime";
import { iconNoti, styleTypeNoti } from "./data";
import { useRouter } from "next/router";

const initNotification: Notification = {
  notifications: [],
  total: 0,
  totalUnread: 0,
};

const Notification = () => {
  const router = useRouter();

  const [notification, setNotification] =
    useState<Notification>(initNotification);

  const onNotification = (item: NotificationItem) => {
    const newNotifications = notification.notifications;
    newNotifications.pop();
    newNotifications.unshift(item);
    setNotification({ ...notification, notifications: newNotifications });
  };

  const onClickNoti = async (data: NotificationItem) => {
    if (data.isReaded) {
      if (data.path) {
        router.push(data.path);
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

        setNotification({ ...notification, notifications });

        if (data.path) {
          router.push(data.path);
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
    handleGetNotifications();
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("notification", onNotification);

    return () => {
      socket.off("notification", onNotification);
    };
  }, [notification]);

  return (
    <div className="sticky top-0 flex flex-col items-end bg-white px-5 py-2 border-b shadow z-30">
      <div className="relative group flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer">
        <FaRegBell className="text-2xl" />
        {notification.totalUnread > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white text-xs bg-primary rounded-full z-0">
            {notification.totalUnread > 99 ? "99" : notification.totalUnread}
          </span>
        )}

        <ul className="absolute w-auto top-[120%] group-hover:top-full right-0 bg-white shadow-lg rounded-md border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all ease-linear duration-100 z-10">
          <div className="absolute -top-8 left-0 right-0 h-10 bg-transparent z-10"></div>
          {notification.notifications.map(
            (item: NotificationItem, index: number) => (
              <li
                key={item._id}
                onClick={() => onClickNoti(item)}
                className={`flex items-center px-5 py-2 hover:bg-slate-100 ${
                  index > 0 ? "border-t" : ""
                } gap-5`}
              >
                <ImageCus
                  src={iconNoti[item.type]}
                  className="min-w-[32px] min-h-[32px] w-8 h-8 rounded-full"
                />
                <div className="w-full flex items-center justify-between gap-5">
                  <div className="w-full">
                    <p
                      className={`text-start whitespace-nowrap text-sm ${
                        !item.isReaded ? "font-medium" : "font-normal"
                      }`}
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

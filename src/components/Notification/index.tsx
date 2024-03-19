import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { getNotifications } from "~/api-client";
import { Notification, NotificationItem } from "~/interface";
import { socket } from "~/ultils/socket";
import ImageCus from "../Image/ImageCus";
import { getDateTime } from "~/helper/datetime";

const initNotification: Notification = {
  notifications: [],
  total: 0,
  totalUnread: 0,
};

const Notification = () => {
  const [notification, setNotification] =
    useState<Notification>(initNotification);

  const onNotification = (item: NotificationItem) => {
    const newNotifications = notification.notifications;
    newNotifications.unshift(item);
    setNotification({ ...notification, notifications: newNotifications });
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
      <button className="relative group flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 rounded-full">
        <FaRegBell className="text-2xl" />
        {notification.totalUnread > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white text-xs bg-primary rounded-full z-0">
            {notification.totalUnread > 99 ? "99" : notification.totalUnread}
          </span>
        )}

        <ul className="absolute w-auto top-[120%] group-hover:top-full right-0 bg-white shadow-lg rounded-md border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all ease-linear duration-100 z-10">
          <div className="absolute -top-8 left-0 right-0 h-10 bg-red-200 z-10"></div>
          {notification.notifications.map(
            (item: NotificationItem, index: number) => (
              <li
                key={item._id}
                className={`flex items-center px-5 py-2 hover:bg-slate-100 ${
                  index > 0 ? "border-t" : ""
                } gap-5`}
              >
                <ImageCus
                  src=""
                  className="min-w-[32px] min-h-[32px] w-8 h-8 rounded-full"
                />
                <div className="w-full flex items-center justify-between gap-5">
                  <div className="w-full">
                    <p className="text-start whitespace-nowrap text-sm">
                      {item.content}
                    </p>
                    <p className="text-start whitespace-nowrap text-xs pt-2">
                      {getDateTime(item.createdAt)}
                    </p>
                  </div>
                  {!item.isReaded && (
                    <span className="block w-2 h-2 rounded-full bg-primary"></span>
                  )}
                </div>
              </li>
            )
          )}
        </ul>
      </button>
    </div>
  );
};

export default Notification;

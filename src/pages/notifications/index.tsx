import { ReactElement, useEffect, useState } from "react";

import { getNotificationsWithPage, updateNotification } from "~/api-client";
import { initPagination } from "~/components/Pagination/initData";
import {
  IPagination,
  IQueryParam,
  INotificationItem,
  TagNotification,
} from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import PaginationCus from "~/components/Pagination";
import { useRouter } from "next/router";
import { NotitficationType } from "~/enums";
import PaginationTop from "~/components/Pagination/PaginationTop";
import NotificationItem from "~/components/Notification/NotificationItem";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import NotificationLoading from "~/components/Notification/NotificationLoading";

const Layout = LayoutWithHeader;

const tagsNotification: TagNotification[] = [
  { title: "All", value: "" },
  { title: "Product", value: NotitficationType.product },
  { title: "Order", value: NotitficationType.order },
];

const NotificationPage: NextPageWithLayout = () => {
  const router = useRouter();
  const currentPage = router.query.page ? Number(router.query.page) : 1;
  const initTag = router.query.tag ? Number(router.query.tag) : 0;

  const [selectTag, setSelectTag] = useState<TagNotification>(
    tagsNotification[initTag] ? tagsNotification[initTag] : tagsNotification[0]
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onSelectTag = (tag: TagNotification, index: number) => {
    router.replace({
      query: { tag: index },
    });
    setSelectTag(tag);
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
      const { status } = await updateNotification(data._id, {
        isReaded: true,
      });

      if (status === 201) {
        const newNotifications: INotificationItem[] = notifications.map(
          (item: INotificationItem) => {
            if (item._id === data._id) {
              item.isReaded = true;
            }

            return item;
          }
        );

        setNotifications(newNotifications);

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

  const handleGetNotifications = async (
    currentPage: number,
    limit: number,
    query: IQueryParam<Partial<INotificationItem>> = {}
  ) => {
    console.log("get noti")
    setLoading(true);

    try {
      const { status, payload, pagination } = await getNotificationsWithPage(
        currentPage,
        limit,
        query
      );
      if (status === 200) {
        setNotifications(payload);
        setPagination(pagination);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetNotifications(currentPage, 10, {
      type: selectTag.value,
    });
  }, [router.query]);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full">
        <h1 className="md:text-3xl text-2xl font-bold dark:text-darkText mb-1">
          Notifications
        </h1>
      </div>
      <div className="w-full pb-10">
        <div className="flex items-center gap-2">
          {tagsNotification.map((tag: TagNotification, index: number) => (
            <button
              key={index}
              onClick={() => onSelectTag(tag, index)}
              className={`text-base min-w-[100px] ${
                tag.value === selectTag.value
                  ? "text-success border-success"
                  : ""
              }  font-medium dark:text-darkText px-5 py-1 border-2 rounded-md`}
            >
              {tag.title}
            </button>
          ))}
        </div>

        {pagination.totalItems > pagination.pageSize && (
          <PaginationTop pagination={pagination} />
        )}

        <ul
          className={`bg-white dark:bg-gray-800 dark:text-white my-5 shadow-lg rounded-md border transition-all ease-linear duration-100 overflow-auto z-10`}
        >
          {!loading &&
            notifications.map((item: INotificationItem, index: number) => (
              <li
                key={item._id}
                onClick={() => onClickNoti(item)}
                className="border-b last:border-none dark:hover:bg-gray-700 hover:bg-slate-200"
              >
                <NotificationItem data={item} onClick={onClickNoti} />
              </li>
            ))}
          {loading &&
            [...new Array(6)].map((item: INotificationItem, index: number) => (
              <li key={index} className="border-b last:border-none">
                <NotificationLoading />
              </li>
            ))}
        </ul>

        {pagination.totalItems > pagination.pageSize && (
          <PaginationCus pagination={pagination} />
        )}
      </div>
    </section>
  );
};

export default NotificationPage;

NotificationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

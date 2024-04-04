import { ReactElement, useEffect, useState } from "react";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";

import { getNotificationsWithPage, updateNotification } from "~/api-client";
import ImageCus from "~/components/Image/ImageCus";
import { iconNoti, styleTypeNoti } from "~/components/Notification/data";
import { initPagination } from "~/components/Pagination/initData";
import { getDateTime } from "~/helper/datetime";
import {
  IPagination,
  IQueryParam,
  NotificationItem,
  TagNotification,
} from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithoutHeader from "~/layouts/LayoutWithoutHeader";
import PaginationCus from "~/components/Pagination";
import { useRouter } from "next/router";
import { NotitficationType } from "~/enums";
import PaginationTop from "~/components/Pagination/PaginationTop";

const Layout = LayoutWithoutHeader;

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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onSelectTag = (tag: TagNotification, index: number) => {
    router.replace({
      query: { tag: index },
    });
    setSelectTag(tag);
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
        const newNotifications: NotificationItem[] = notifications.map(
          (item: NotificationItem) => {
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
    query: IQueryParam<Partial<NotificationItem>> = {}
  ) => {
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
  };

  useEffect(() => {
    handleGetNotifications(currentPage, 10, {
      type: selectTag.value,
    });
  }, [router.query, selectTag]);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full">
        <h1 className="md:text-3xl text-2xl font-bold mb-1">Notifications</h1>
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
              }  font-medium px-5 py-1 border-2 rounded-md`}
            >
              {tag.title}
            </button>
          ))}
        </div>

        {pagination.totalItems > pagination.pageSize && (
          <PaginationTop pagination={pagination} />
        )}
        
        <ul
          className={`bg-white my-5 shadow-lg rounded-md border transition-all ease-linear duration-100 overflow-auto z-10`}
        >
          {notifications.map((item: NotificationItem, index: number) => (
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
          ))}
          {!notifications.length && (
            <li
              className={`flex items-center px-5 py-2 whitespace-nowrap gap-5`}
            >
              No notification
            </li>
          )}
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

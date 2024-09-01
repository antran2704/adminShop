import { Fragment, useEffect, useMemo, useState } from "react";
import { message, Switch, TableColumnsType } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

import { IPagination } from "~/interface";
import { IBlogTagTable } from "~/interface/blog/blogTag";

import { TableCore } from "../Core";
import ImageCus from "../Image/ImageCus";
import { formatDate } from "~/helper/format/datetime";
import { BtnDelete, BtnEdit } from "../Button";
import { ModalConfirm } from "../Modal";
import { initPagination } from "../Pagination/initData";
import {
  activeTagBlog,
  deleteTagBlog,
  disableTagBlog,
} from "~/api-client/blogs/tagBlog";

interface Props {
  data: IBlogTagTable[];
  pagination: IPagination;
  loading?: boolean;
  getData: () => void;
  onChangePage: (page: number, pageSize: number) => void;
}

const BlogTagTable = (props: Props) => {
  const {
    data,
    loading = false,
    pagination = initPagination,
    getData,
    onChangePage,
  } = props;

  const t = useTranslations("BlogTagPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<IBlogTagTable[]>([]);
  const [selectDelete, setSelectDelete] = useState<IBlogTagTable | null>(null);

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnsType<IBlogTagTable> = useMemo(() => {
    return [
      {
        title: t("table.title"),
        dataIndex: "title",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("table.thumbnail"),
        dataIndex: "image",
        className: "whitespace-nowrap",
        align: "center",
        render: (image: string) => {
          return (
            <ImageCus
              src={image}
              title="banner thumbnail"
              className="w-[160px] min-w-[160px] h-[160px] object-cover object-center rounded-md mx-auto"
            />
          );
        },
      },
      {
        title: t("table.status"),
        dataIndex: "public",
        className: "whitespace-nowrap",
        render: (isPublic: boolean, reccord: IBlogTagTable) => (
          <Switch
            checked={isPublic}
            onClick={() => {
              if (isPublic) {
                onDisable(reccord);
              } else {
                onActive(reccord);
              }
            }}
          />
        ),
        align: "center",
      },
      {
        title: t("table.createdAt"),
        dataIndex: "createdAt",
        className: "whitespace-nowrap",
        align: "center",
        render: (date: string) => {
          return (
            <span className="whitespace-nowrap capitalize block text-sm mx-auto">
              {formatDate(date)}
            </span>
          );
        },
      },
      {
        title: t("table.action"),
        dataIndex: "action",
        className: "whitespace-nowrap",
        align: "center",
        render: (_, record: IBlogTagTable) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <BtnDelete
                onClick={() => {
                  setSelectDelete(record);
                  handlePopup();
                }}
              />
              <BtnEdit
                onClick={() => router.push(`/edit/blog-tag/${record.id}`)}
              />
            </div>
          );
        },
      },
    ];
  }, [router.locale, listItem]);

  const handlePopup = () => {
    if (modalDelete) {
      setSelectDelete(null);
    }

    setModalDelete(!modalDelete);
  };

  const onActive = async (reccord: IBlogTagTable) => {
    try {
      await activeTagBlog(reccord.id);

      const indexItem: number = listItem.findIndex(
        (item: IBlogTagTable) => item.id === reccord.id,
      );

      if (indexItem > -1) {
        const newItems: IBlogTagTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, public: true };
        setListItem(newItems);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDisable = async (reccord: IBlogTagTable) => {
    try {
      await disableTagBlog(reccord.id);

      const indexItem: number = listItem.findIndex(
        (item: IBlogTagTable) => item.id === reccord.id,
      );

      if (indexItem > -1) {
        const newItems: IBlogTagTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, public: false };
        setListItem(newItems);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDelete = async () => {
    if (!selectDelete) return;

    try {
      await deleteTagBlog(selectDelete.id);
      setModalDelete(false);
      setSelectDelete(null);
      getData();

      messageApi.success(tSuccess("delete"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  useEffect(() => {
    setListItem(data);
  }, [data]);

  return (
    <Fragment>
      <TableCore
        dataSource={listItem}
        loading={loading}
        columns={columns}
        size="large"
        scroll={{ x: 1200 }}
        showPagination={pagination.total > 0}
        paginationOptions={{
          total: pagination.total,
          pageSize: pagination.take,
          current: pagination.page,
          onChange: onChangePage,
        }}
      />

      <ModalConfirm
        title={t("modalDelete.title")}
        open={modalDelete}
        onCancel={handlePopup}
        centered
        type="error"
        destroyOnClose
        onOk={onDelete}>
        <img
          src="/popup/trash.svg"
          className="size-[200px] mx-auto"
          title="delete image"
          alt="delete image"
        />
        <p className="md:text-lg text-base text-center mb-10">
          {t("modalDelete.description")}
        </p>
      </ModalConfirm>

      {/* Message of antd */}
      {contextHolder}
    </Fragment>
  );
};

export default BlogTagTable;

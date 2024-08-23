import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Button, message, Switch, TableColumnsType } from "antd";
import { AiOutlineAppstore } from "react-icons/ai";

import { IAttributeTable, IPagination } from "~/interface";
import {
  activeAttribute,
  deleteAttribute,
  disableAttribute,
} from "~/api-client";

import { TableCore } from "../Core";
import { formatDate } from "~/helper/format/datetime";
import { BtnDelete, BtnEdit } from "../Button";
import { ModalConfirm } from "../Modal";
import { initPagination } from "../Pagination/initData";

interface Props {
  data: IAttributeTable[];
  pagination: IPagination;
  loading?: boolean;
  getData: () => void;
  onChangePage: (page: number, pageSize: number) => void;
}

const AttributeTable = (props: Props) => {
  const {
    data,
    loading = false,
    pagination = initPagination,
    getData,
    onChangePage,
  } = props;

  const t = useTranslations("AttributePage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<IAttributeTable[]>([]);
  const [selectDelete, setSelectDelete] = useState<IAttributeTable | null>(
    null,
  );

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnsType<IAttributeTable> = useMemo(() => {
    return [
      {
        title: t("table.code"),
        dataIndex: "code",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("table.title"),
        dataIndex: "title",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("table.status"),
        dataIndex: "public",
        className: "whitespace-nowrap",
        render: (isPublic: boolean, reccord: IAttributeTable) => (
          <Switch
            checked={isPublic}
            onClick={() => {
              if (isPublic) {
                onDisableItem(reccord);
              } else {
                onActiveItem(reccord);
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
        render: (_, record: IAttributeTable) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <BtnDelete
                onClick={() => {
                  setSelectDelete(record);
                  handlePopup();
                }}
              />
              <Button
                title="Chỉnh sửa thuộc tính con"
                size="middle"
                icon={<AiOutlineAppstore className="text-xl" />}
                onClick={() => router.push(`/attributes/${record._id}`)}
              />

              <BtnEdit
                title="Chỉnh sửa thuộc tính"
                onClick={() => router.push(`/edit/attribute/${record._id}`)}
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

  const onActiveItem = async (reccord: IAttributeTable) => {
    try {
      await activeAttribute(reccord._id);

      const indexItem: number = listItem.findIndex(
        (item: IAttributeTable) => item._id === reccord._id,
      );

      if (indexItem > -1) {
        const newItems: IAttributeTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, public: true };
        setListItem(newItems);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDisableItem = async (reccord: IAttributeTable) => {
    try {
      await disableAttribute(reccord._id);

      const indexItem: number = listItem.findIndex(
        (item: IAttributeTable) => item._id === reccord._id,
      );

      if (indexItem > -1) {
        const newItems: IAttributeTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, public: false };
        setListItem(newItems);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDeleteItem = async () => {
    if (!selectDelete) return;

    try {
      await deleteAttribute(selectDelete._id);
      setModalDelete(false);
      setSelectDelete(null);
      getData();

      messageApi.success(tSuccess("create"));
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
        onOk={onDeleteItem}>
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

export default AttributeTable;

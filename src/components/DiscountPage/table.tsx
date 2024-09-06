import { Fragment, useEffect, useMemo, useState } from "react";
import { message, Switch, TableColumnsType } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

import { IPagination } from "~/interface";
import { IDiscountTable } from "~/interface/discount";

import {
  activeDiscount,
  deleteDiscount,
  disableDiscount,
} from "~/api-client/discounts";

import { TableCore } from "../Core";
import ImageCus from "../Image/ImageCus";
import { formatDate } from "~/helper/format/datetime";
import { BtnDelete, BtnEdit } from "../Button";
import { ModalConfirm } from "../Modal";
import { initPagination } from "../Pagination/initData";
import { ENUM_DISCOUNT_TYPE } from "~/enums/discount";

interface Props {
  data: IDiscountTable[];
  pagination: IPagination;
  loading?: boolean;
  getData: () => void;
  onChangePage: (page: number, pageSize: number) => void;
}

const DiscountTable = (props: Props) => {
  const {
    data,
    loading = false,
    pagination = initPagination,
    getData,
    onChangePage,
  } = props;

  const t = useTranslations("DiscountPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<IDiscountTable[]>([]);
  const [selectDelete, setSelectDelete] = useState<IDiscountTable | null>(null);

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnsType<IDiscountTable> = useMemo(() => {
    return [
      {
        title: t("table.name"),
        dataIndex: "name",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("table.code"),
        dataIndex: "code",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("table.thumbnail"),
        dataIndex: "thumbnail",
        className: "whitespace-nowrap",
        align: "center",
        render: (image: string) => {
          return (
            <ImageCus
              src={image}
              title="banner thumbnail"
              className="w-[140px] min-w-[140px] h-[140px] object-cover object-center rounded-md mx-auto"
            />
          );
        },
      },
      {
        title: t("table.type"),
        dataIndex: "type",
        className: "whitespace-nowrap",
        align: "center",
        render: (value: ENUM_DISCOUNT_TYPE) => {
          return (
            <span className="whitespace-nowrap capitalize block text-sm mx-auto">
              {value === ENUM_DISCOUNT_TYPE.FIXED_AMOUNT && t("type.fixed")}
              {value === ENUM_DISCOUNT_TYPE.PERCENTAGE && t("type.percentage")}
            </span>
          );
        },
      },
      {
        title: t("table.startDate"),
        dataIndex: "startDate",
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
        title: t("table.endDate"),
        dataIndex: "endDate",
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
        title: t("table.status"),
        dataIndex: "active",
        className: "whitespace-nowrap",
        align: "center",
        fixed: "right",
        render: (isPublic: boolean, reccord: IDiscountTable) => (
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
      },
      {
        title: t("table.action"),
        dataIndex: "action",
        className: "whitespace-nowrap",
        align: "center",
        fixed: "right",
        render: (_, record: IDiscountTable) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <BtnDelete
                onClick={() => {
                  setSelectDelete(record);
                  handlePopup();
                }}
              />
              <BtnEdit
                onClick={() => router.push(`/edit/discount/${record.id}`)}
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

  const onActive = async (reccord: IDiscountTable) => {
    try {
      await activeDiscount(reccord.id);

      const indexItem: number = listItem.findIndex(
        (item: IDiscountTable) => item.id === reccord.id,
      );

      if (indexItem > -1) {
        const newItems: IDiscountTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, active: true };
        setListItem(newItems);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDisable = async (reccord: IDiscountTable) => {
    try {
      await disableDiscount(reccord.id);

      const indexItem: number = listItem.findIndex(
        (item: IDiscountTable) => item.id === reccord.id,
      );

      if (indexItem > -1) {
        const newItems: IDiscountTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, active: false };
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
      await deleteDiscount(selectDelete.id);
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
        scroll={{ x: 2000 }}
        size="large"
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

export default DiscountTable;

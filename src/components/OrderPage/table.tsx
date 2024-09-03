import { useEffect, useMemo, useState } from "react";
import { ICurrency, IPagination } from "~/interface";
import { TableCore } from "../Core";
import { TableColumnsType } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import clsx from "clsx";

import { formatDate } from "~/helper/format/datetime";
import { BtnEdit } from "../Button";
import { initPagination } from "../Pagination/initData";
import { IOrderTable } from "~/interface/order";
import { formatBigNumber } from "~/helper/format/number";
import { ENUM_ORDER_STATUS, ENUM_PAYMENT_METHOD } from "~/enums/order";
import CURRENCY from "~/common/currency";

interface Props {
  data: IOrderTable[];
  pagination?: IPagination;
  loading?: boolean;
  showPagination?: boolean;
  onChangePage?: (page: number, pageSize: number) => void;
}

const Table = (props: Props) => {
  const {
    data,
    loading = false,
    pagination = initPagination,
    showPagination = true,
    onChangePage,
  } = props;

  const t = useTranslations("OrderPage");

  const router = useRouter();

  const [listItem, setListItem] = useState<IOrderTable[]>([]);

  const columns: TableColumnsType<IOrderTable> = useMemo(() => {
    return [
      {
        title: t("table.id"),
        dataIndex: "id",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("table.customer"),
        dataIndex: "customer",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("table.total"),
        dataIndex: "total",
        className: "whitespace-nowrap",
        align: "center",
        render: (value: number) => {
          const currency: ICurrency =
            CURRENCY[router.locale as keyof typeof CURRENCY];

          return (
            <span>
              {value
                ? `${formatBigNumber(currency.calc(value), currency.locale, { style: "currency", currency: currency.symbol })}`
                : 0}
            </span>
          );
        },
      },
      {
        title: t("table.status"),
        dataIndex: "orderStatus",
        className: "whitespace-nowrap",
        align: "center",
        render: (value: ENUM_ORDER_STATUS) => {
          let bg: string;

          switch (value) {
            case ENUM_ORDER_STATUS.PENDING:
              bg = "bg-warn";
              break;

            case ENUM_ORDER_STATUS.PROCESS:
              bg = "bg-primary";
              break;

            case ENUM_ORDER_STATUS.SUCCESS:
              bg = "bg-success";
              break;

            case ENUM_ORDER_STATUS.SHIPPING:
              bg = "bg-[#5856d6]";
              break;

            case ENUM_ORDER_STATUS.CANCEL:
              bg = "bg-error";
              break;
          }

          return (
            <span
              className={clsx(
                "block min-w-[100px] w-fit font-medium text-white text-sm text-center capitalize px-5 py-2 mx-auto rounded-md",
                [bg],
              )}>
              {value === ENUM_ORDER_STATUS.PENDING && t("orderStatus.pending")}
              {value === ENUM_ORDER_STATUS.PROCESS && t("orderStatus.process")}
              {value === ENUM_ORDER_STATUS.SHIPPING &&
                t("orderStatus.shipping")}
              {value === ENUM_ORDER_STATUS.SUCCESS && t("orderStatus.success")}
              {value === ENUM_ORDER_STATUS.CANCEL && t("orderStatus.cancel")}
            </span>
          );
        },
      },
      {
        title: t("table.paymentMethod"),
        dataIndex: "paymentMethod",
        className: "whitespace-nowrap",
        render: (value: ENUM_PAYMENT_METHOD) => (
          <span>
            {value === ENUM_PAYMENT_METHOD.COD && t("paymentMethod.cod")}
            {value === ENUM_PAYMENT_METHOD.BANKING &&
              t("paymentMethod.banking")}
            {value === ENUM_PAYMENT_METHOD.CASH && t("paymentMethod.cash")}
            {value === ENUM_PAYMENT_METHOD.CARD && t("paymentMethod.card")}
            {value === ENUM_PAYMENT_METHOD.VNPAY && t("paymentMethod.vnPay")}
          </span>
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
        render: (_, record: IOrderTable) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <BtnEdit onClick={() => router.push(`/orders/${record.id}`)} />
            </div>
          );
        },
      },
    ];
  }, [router.locale, listItem]);

  useEffect(() => {
    setListItem(data);
  }, [data]);

  return (
    <TableCore
      dataSource={listItem}
      loading={loading}
      columns={columns}
      size="large"
      showPagination={showPagination}
      paginationOptions={{
        total: pagination.total,
        pageSize: pagination.take,
        current: pagination.page,
        onChange: onChangePage,
      }}
    />
  );
};

export default Table;

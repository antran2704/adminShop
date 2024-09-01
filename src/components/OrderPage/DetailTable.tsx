import { useEffect, useMemo, useState } from "react";
import { ICurrency } from "~/interface";
import { TableCore } from "../Core";
import { TableColumnsType } from "antd";
import { useTranslations } from "next-intl";

import { useRouter } from "next/router";
import { IOrderDetailTable } from "~/interface/order";
import { formatBigNumber } from "~/helper/format/number";
import CURRENCY from "~/common/currency";
import ImageCus from "../Image/ImageCus";

interface Props {
  data: IOrderDetailTable[];
  loading?: boolean;
}

const DetailTable = (props: Props) => {
  const { data, loading = false } = props;

  const t = useTranslations("OrderPage");

  const router = useRouter();

  const [listItem, setListItem] = useState<IOrderDetailTable[]>([]);

  const columns: TableColumnsType<IOrderDetailTable> = useMemo(() => {
    return [
      {
        title: t("tableDetail.orderNumber"),
        dataIndex: "orderNumber",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("tableDetail.product"),
        dataIndex: "productName",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("tableDetail.thumbnail"),
        dataIndex: "thumbnail",
        className: "whitespace-nowrap",
        align: "center",
        render: (image: string) => {
          return (
            <ImageCus
              src={image}
              title="product thumbnail"
              className="w-[140px] min-w-[140px] h-[140px] object-cover object-center rounded-md mx-auto"
            />
          );
        },
      },
      {
        title: t("tableDetail.price"),
        dataIndex: "price",
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
        title: t("tableDetail.promotionPrice"),
        dataIndex: "promotionPrice",
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
        title: t("tableDetail.quantity"),
        dataIndex: "quantity",
        className: "whitespace-nowrap",
        align: "center",
        render: (value: number) => (
          <span>{value ? formatBigNumber(value) : 0}</span>
        ),
      },
      {
        title: t("tableDetail.amount"),
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
      showPagination={false}
    />
  );
};

export default DetailTable;

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
        title: t("detailTable.orderNumber"),
        dataIndex: "orderNumber",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: t("detailTable.product"),
        dataIndex: "productName",
        className: "whitespace-nowrap",
        align: "center",
        render: (value: string, record: IOrderDetailTable) => {
          return (
            <div className="flex items-center gap-5">
              <ImageCus
                src={record.thumbnail}
                title="product thumbnail"
                className="w-[140px] h-[140px] object-cover object-center rounded-md"
              />
              <span>{value}</span>
            </div>
          );
        },
      },
      {
        title: t("detailTable.price"),
        dataIndex: "price",
        className: "whitespace-nowrap",
        align: "center",
        render: (value: number, record: IOrderDetailTable) => {
          const currency: ICurrency =
            CURRENCY[router.locale as keyof typeof CURRENCY];

          return (
            <div>
              <p>
                {`${formatBigNumber(currency.calc(!!record.promotionPrice ? record.promotionPrice : value), currency.locale, { style: "currency", currency: currency.symbol })} X ${record.quantity}`}
              </p>

              {!!record.promotionPrice && (
                <p className="line-through text-neutral-500">{value}</p>
              )}
            </div>
          );
        },
      },
      {
        title: t("detailTable.amount"),
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

import { useRouter } from "next/router";
import { TableCore } from "../Core";
import { Switch, TableColumnsType } from "antd";
import { useEffect, useMemo, useState } from "react";
import { IVariantTable } from "~/interface";
import { useTranslations } from "next-intl";
import ImageCus from "../Image/ImageCus";
import { PATH_IMAGE } from "~/common/images";
import { formatBigNumber } from "~/helper/format/number";
import { ButtonDelete } from "../Button";

interface Props {
  data: IVariantTable[];
  loading?: boolean;
  getData: () => void;
}

const VariantTable = (props: Props) => {
  const { data } = props;

  const router = useRouter();

  const t = useTranslations("ProductPage");

  const [listItem, setListItem] = useState<IVariantTable[]>([]);

  const columns: TableColumnsType<IVariantTable> =
    useMemo((): TableColumnsType<IVariantTable> => {
      return [
        {
          title: t("table.thumbnail"),
          dataIndex: "thumbnail",
          className: "whitespace-nowrap",
          align: "center",
          render: (image: string) => {
            return (
              <ImageCus
                src={PATH_IMAGE + image}
                title="banner thumbnail"
                className="w-[260px] min-w-[260px] h-[140px] object-cover object-center rounded-md mx-auto"
              />
            );
          },
        },
        {
          title: t("table.id"),
          dataIndex: "productId",
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
          title: t("table.category"),
          dataIndex: "category",
          className: "whitespace-nowrap",
          align: "center",
        },
        {
          title: t("table.price"),
          dataIndex: "price",
          className: "whitespace-nowrap",
          align: "center",
          width: 200,
          render: (value: number) => (
            <span>{value ? formatBigNumber(value) : 0}</span>
          ),
        },
        {
          title: t("table.promotionPrice"),
          dataIndex: "promotionPrice",
          className: "whitespace-nowrap",
          align: "center",
          width: 200,
          render: (value: number) => (
            <span>{value ? formatBigNumber(value) : 0}</span>
          ),
        },
        {
          title: t("table.inventory"),
          dataIndex: "inventory",
          className: "whitespace-nowrap",
          align: "center",
          width: 140,
          render: (value: number) => (
            <span>{value ? formatBigNumber(value) : 0}</span>
          ),
        },
        {
          title: t("table.status"),
          dataIndex: "public",
          className: "whitespace-nowrap",
          width: 200,
          render: (isPublic: boolean, reccord: IVariantTable) => (
            <Switch
              checked={isPublic}
              onClick={() => {
                // if (isPublic) {
                //   onDisableBanner(reccord);
                // } else {
                //   onActiveBanner(reccord);
                // }
              }}
            />
          ),
          align: "center",
        },
        {
          title: t("table.action"),
          dataIndex: "action",
          className: "whitespace-nowrap",
          align: "center",
          width: 200,
          fixed: "right",
          render: (_, record: IVariantTable) => {
            return (
              <div className="flex items-center justify-center gap-2">
                <ButtonDelete onClick={() => {}} />
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
      //   loading={loading}
      columns={columns}
      scroll={{ x: 2400 }}
      size="large"
    />
  );
};

export default VariantTable;

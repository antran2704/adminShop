import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { message, Switch, TableColumnsType } from "antd";

import { IProductTable, IPagination } from "~/interface";
import { activeProduct, deleteProduct, disableProduct } from "~/api-client";

import { formatBigNumber } from "~/helper/format/number";

import { TableCore } from "../Core";
import ImageCus from "../Image/ImageCus";

import { formatDate } from "~/helper/format/datetime";
import { BtnDelete, BtnEdit } from "../Button";
import { ModalConfirm } from "../Modal";
import { initPagination } from "../Pagination/initData";

interface Props {
  data: IProductTable[];
  pagination: IPagination;
  loading?: boolean;
  getData: () => void;
  onChangePage: (page: number, pageSize: number) => void;
}

const ProductTable = (props: Props) => {
  const {
    data,
    loading = false,
    pagination = initPagination,
    getData,
    onChangePage,
  } = props;

  const t = useTranslations("ProductPage");
  const tError = useTranslations("Error");
  const tCommon = useTranslations("Common");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<IProductTable[]>([]);
  const [selectDelete, setSelectDelete] = useState<IProductTable | null>(null);

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnsType<IProductTable> =
    useMemo((): TableColumnsType<IProductTable> => {
      return [
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
          title: t("table.thumbnail"),
          dataIndex: "thumbnail",
          className: "whitespace-nowrap",
          align: "center",
          render: (image: string) => {
            return (
              <ImageCus
                src={image}
                title="Thumbnail"
                className="w-[260px] min-w-[260px] h-[140px] object-cover object-center rounded-md mx-auto"
              />
            );
          },
        },
        {
          title: t("table.category"),
          dataIndex: "category",
          className: "whitespace-nowrap",
          align: "center",
          render: (value: string) => (
            <span>{value ? value : tCommon("noData")}</span>
          ),
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
          render: (isPublic: boolean, reccord: IProductTable) => (
            <Switch
              checked={isPublic}
              onClick={() => {
                if (isPublic) {
                  onDisableProduct(reccord);
                } else {
                  onActiveProduct(reccord);
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
          width: 200,
          fixed: "right",
          render: (_, record: IProductTable) => {
            return (
              <div className="flex items-center justify-center gap-2">
                <BtnDelete
                  onClick={() => {
                    setSelectDelete(record);
                    handlePopup();
                  }}
                />
                <BtnEdit
                  onClick={() =>
                    router.push(`/edit/product/${record.productId}`)
                  }
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

  const onActiveProduct = async (reccord: IProductTable) => {
    try {
      await activeProduct(reccord.productId);

      const indexItem: number = listItem.findIndex(
        (item: IProductTable) => item.productId === reccord.productId,
      );

      if (indexItem > -1) {
        const newItems: IProductTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, public: true };
        setListItem(newItems);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDisableProduct = async (reccord: IProductTable) => {
    try {
      await disableProduct(reccord.productId);

      const indexItem: number = listItem.findIndex(
        (item: IProductTable) => item.productId === reccord.productId,
      );

      if (indexItem > -1) {
        const newItems: IProductTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, public: false };
        setListItem(newItems);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDeleteProduct = async () => {
    if (!selectDelete) return;

    try {
      await deleteProduct(selectDelete.productId);
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
        scroll={{ x: 2400 }}
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
        onOk={onDeleteProduct}>
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

export default ProductTable;

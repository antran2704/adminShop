import { Fragment, useEffect, useMemo, useState } from "react";
import { IProductTable, IPagination } from "~/interface";
import { TableCore } from "../Core";
import { message, Switch, TableColumnsType } from "antd";
import { activeBanner, deleteBanner, disableBanner } from "~/api-client";
import { useTranslations } from "next-intl";
import ImageCus from "../Image/ImageCus";
import { PATH_IMAGE } from "~/common/images";
import { formatDate } from "~/helper/format/datetime";
import { ButtonDelete, ButtonEdit } from "../Button";
import { useRouter } from "next/router";
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
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<IProductTable[]>([]);
  const [selectDelete, setSelectDelete] = useState<IProductTable | null>(null);

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnsType<IProductTable> = useMemo(() => {
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
              src={PATH_IMAGE + image}
              title="banner thumbnail"
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
      },
      {
        title: t("table.status"),
        dataIndex: "public",
        className: "whitespace-nowrap",
        render: (isPublic: boolean, reccord: IProductTable) => (
          <Switch
            checked={isPublic}
            onClick={() => {
              if (isPublic) {
                onDisableBanner(reccord);
              } else {
                onActiveBanner(reccord);
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
        render: (_, record: IProductTable) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <ButtonDelete
                onClick={() => {
                  setSelectDelete(record);
                  handlePopup();
                }}
              />
              <ButtonEdit
                onClick={() => router.push(`/edit/product/${record.productId}`)}
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

  const onActiveBanner = async (reccord: IProductTable) => {
    try {
      await activeBanner(reccord.productId);

      const indexItem: number = listItem.findIndex(
        (banner: IProductTable) => banner.productId === reccord.productId,
      );

      if (indexItem > -1) {
        const newBanners: IProductTable[] = [...listItem];
        newBanners[indexItem] = { ...reccord, public: true };
        setListItem(newBanners);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDisableBanner = async (reccord: IProductTable) => {
    try {
      await disableBanner(reccord.productId);

      const indexItem: number = listItem.findIndex(
        (banner: IProductTable) => banner.productId === reccord.productId,
      );

      if (indexItem > -1) {
        const newBanners: IProductTable[] = [...listItem];
        newBanners[indexItem] = { ...reccord, public: false };
        setListItem(newBanners);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDeleteBanner = async () => {
    if (!selectDelete) return;

    try {
      await deleteBanner(selectDelete.productId);
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
        onOk={onDeleteBanner}>
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

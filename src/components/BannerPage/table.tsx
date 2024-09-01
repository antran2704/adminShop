import { Fragment, useEffect, useMemo, useState } from "react";
import { message, Switch, TableColumnsType } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

import { IBannerTable, IPagination } from "~/interface";

import { TableCore } from "../Core";
import { activeBanner, deleteBanner, disableBanner } from "~/api-client";
import ImageCus from "../Image/ImageCus";
import { formatDate } from "~/helper/format/datetime";
import { BtnDelete, BtnEdit } from "../Button";
import { ModalConfirm } from "../Modal";
import { initPagination } from "../Pagination/initData";

interface Props {
  data: IBannerTable[];
  pagination: IPagination;
  loading?: boolean;
  getData: () => void;
  onChangePage: (page: number, pageSize: number) => void;
}

const BannerTable = (props: Props) => {
  const {
    data,
    loading = false,
    pagination = initPagination,
    getData,
    onChangePage,
  } = props;

  const tBanner = useTranslations("BannerPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<IBannerTable[]>([]);
  const [selectDelete, setSelectDelete] = useState<IBannerTable | null>(null);

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnsType<IBannerTable> = useMemo(() => {
    return [
      {
        title: tBanner("table.id"),
        dataIndex: "bannerId",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: tBanner("table.title"),
        dataIndex: "title",
        className: "whitespace-nowrap",
        align: "center",
      },
      {
        title: tBanner("table.thumbnail"),
        dataIndex: "image",
        className: "whitespace-nowrap",
        align: "center",
        render: (image: string) => {
          return (
            <ImageCus
              src={image}
              title="banner thumbnail"
              className="w-[260px] min-w-[260px] h-[140px] object-cover object-center rounded-md mx-auto"
            />
          );
        },
      },
      {
        title: tBanner("table.status"),
        dataIndex: "public",
        className: "whitespace-nowrap",
        render: (isPublic: boolean, reccord: IBannerTable) => (
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
        title: tBanner("table.createdAt"),
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
        title: tBanner("table.action"),
        dataIndex: "action",
        className: "whitespace-nowrap",
        align: "center",
        render: (_, record: IBannerTable) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <BtnDelete
                onClick={() => {
                  setSelectDelete(record);
                  handlePopup();
                }}
              />
              <BtnEdit
                onClick={() => router.push(`/edit/banner/${record.bannerId}`)}
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

  const onActiveBanner = async (reccord: IBannerTable) => {
    try {
      await activeBanner(reccord.bannerId);

      const indexItem: number = listItem.findIndex(
        (banner: IBannerTable) => banner.bannerId === reccord.bannerId,
      );

      if (indexItem > -1) {
        const newBanners: IBannerTable[] = [...listItem];
        newBanners[indexItem] = { ...reccord, public: true };
        setListItem(newBanners);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDisableBanner = async (reccord: IBannerTable) => {
    try {
      await disableBanner(reccord.bannerId);

      const indexItem: number = listItem.findIndex(
        (banner: IBannerTable) => banner.bannerId === reccord.bannerId,
      );

      if (indexItem > -1) {
        const newBanners: IBannerTable[] = [...listItem];
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
      await deleteBanner(selectDelete.bannerId);
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
        showPagination={pagination.total > 0}
        paginationOptions={{
          total: pagination.total,
          pageSize: pagination.take,
          current: pagination.page,
          onChange: onChangePage,
        }}
      />

      <ModalConfirm
        title={tBanner("modalDelete.title")}
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
          {tBanner("modalDelete.description")}
        </p>
      </ModalConfirm>

      {/* Message of antd */}
      {contextHolder}
    </Fragment>
  );
};

export default BannerTable;

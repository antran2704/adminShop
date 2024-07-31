import { Fragment, useEffect, useMemo, useState } from "react";
import { ICategoryTable, IPagination } from "~/interface";
import { TableCore } from "../Core";
import { message, Switch, TableColumnsType } from "antd";
import { activeCategory, deleteCategory, disableCategory } from "~/api-client";
import { useTranslations } from "next-intl";
import ImageCus from "../Image/ImageCus";
import { PATH_IMAGE } from "~/common/images";
import { formatDate } from "~/helper/format/datetime";
import { ButtonDelete, ButtonEdit } from "../Button";
import { useRouter } from "next/router";
import { ModalConfirm } from "../Modal";
import { initPagination } from "../Pagination/initData";

interface Props {
  data: ICategoryTable[];
  pagination: IPagination;
  loading?: boolean;
  getData: () => void;
  onChangePage: (page: number, pageSize: number) => void;
}

const CategoryTable = (props: Props) => {
  const {
    data,
    loading = false,
    pagination = initPagination,
    getData,
    onChangePage,
  } = props;

  const t = useTranslations("CategoriesPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [listItem, setListItem] = useState<ICategoryTable[]>([]);
  const [selectDelete, setSelectDelete] = useState<ICategoryTable | null>(null);

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnsType<ICategoryTable> = useMemo(() => {
    return [
      {
        title: t("table.id"),
        dataIndex: "id",
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
        dataIndex: "image",
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
        title: t("table.status"),
        dataIndex: "public",
        className: "whitespace-nowrap",
        render: (isPublic: boolean, reccord: ICategoryTable) => (
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
        render: (_, record: ICategoryTable) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <ButtonDelete
                onClick={() => {
                  setSelectDelete(record);
                  handlePopup();
                }}
              />
              <ButtonEdit
                onClick={() => router.push(`/edit/category/${record.id}`)}
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

  const onActiveItem = async (reccord: ICategoryTable) => {
    try {
      await activeCategory(reccord.id);

      const indexItem: number = listItem.findIndex(
        (item: ICategoryTable) => item.id === reccord.id,
      );

      if (indexItem > -1) {
        const newItems: ICategoryTable[] = [...listItem];
        newItems[indexItem] = { ...reccord, public: true };
        setListItem(newItems);
      }

      messageApi.success(tSuccess("update"));
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const onDisableItem = async (reccord: ICategoryTable) => {
    try {
      await disableCategory(reccord.id);

      const indexItem: number = listItem.findIndex(
        (item: ICategoryTable) => item.id === reccord.id,
      );

      if (indexItem > -1) {
        const newItems: ICategoryTable[] = [...listItem];
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
      await deleteCategory(selectDelete.id);
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
        title={t("ModalDelete.title")}
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
          {t("ModalDelete.description")}
        </p>
      </ModalConfirm>

      {/* Message of antd */}
      {contextHolder}
    </Fragment>
  );
};

export default CategoryTable;

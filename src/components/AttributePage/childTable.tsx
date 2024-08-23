import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Button, message, Switch, TableColumnsType } from "antd";
import { CiCirclePlus } from "react-icons/ci";
import { v4 as uuidv4 } from "uuid";

import {
  IAttributeChildTable,
  INewAttributeChild,
  IPagination,
} from "~/interface";
import {
  activeChildAttribute,
  createChildAttribute,
  deleteChildAttribute,
  disableChildAttribute,
  updateChildAttribute,
} from "~/api-client";

import { TableCore } from "../Core";
import { formatDate } from "~/helper/format/datetime";
import { BtnCancel, BtnCheck, BtnDelete, BtnEdit } from "../Button";
import { ModalConfirm } from "../Modal";
import { initPagination } from "../Pagination/initData";
import { InputText } from "../Core/Input";

interface Props {
  attributeId: string;
  data: IAttributeChildTable[];
  pagination: IPagination;
  loading?: boolean;
  getData: () => void;
  onChangePage: (page: number, pageSize: number) => void;
}

const AttributeChildTable = (props: Props) => {
  const {
    attributeId,
    data,
    loading = false,
    pagination = initPagination,
    getData,
    onChangePage,
  } = props;

  const t = useTranslations("AttributePage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");
  const tCommon = useTranslations("Common");

  const router = useRouter();

  const [listItem, setListItem] = useState<IAttributeChildTable[]>([]);
  const [selectDelete, setSelectDelete] = useState<IAttributeChildTable | null>(
    null,
  );

  const [listEdit, setListEdit] = useState<{
    [x: string]: IAttributeChildTable;
  }>({});

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handlePopup = () => {
    if (modalDelete) {
      setSelectDelete(null);
    }

    setModalDelete(!modalDelete);
  };

  const onAddItem = () => {
    const newItem: IAttributeChildTable = {
      key: `new-${uuidv4()}`,
      _id: `new-${uuidv4()}`,
      title: "",
      public: true,
      createdAt: "",
    };

    setListEdit({ ...listEdit, [newItem._id]: newItem });
    setListItem([...listItem, newItem]);
  };

  const onChangeValue = (
    data: IAttributeChildTable,
    key: keyof IAttributeChildTable,
    value: string | number,
  ) => {
    const newItems = { ...listEdit };

    (newItems[data._id][key] as any) = value;
    setListEdit(newItems);
  };

  const onActiveItem = async (record: IAttributeChildTable) => {
    if (!record._id.includes("new")) {
      await activeChildAttribute(record._id)
        .then(() => {
          messageApi.success(tSuccess("update"));
        })
        .catch(() => {
          messageApi.error(tError("TRY_AGAIN"));
        });
    }

    const indexItem: number = listItem.findIndex(
      (item: IAttributeChildTable) => item._id === record._id,
    );

    if (indexItem > -1) {
      const newItems: IAttributeChildTable[] = [...listItem];
      newItems[indexItem] = { ...record, public: true };

      setListItem(newItems);
    }

    if (listEdit[record._id]) {
      setListEdit({ ...listEdit, [record._id]: { ...record, public: true } });
    }
  };

  const onDisableItem = async (record: IAttributeChildTable) => {
    if (!record._id.includes("new")) {
      await disableChildAttribute(record._id)
        .then(() => {
          messageApi.success(tSuccess("update"));
        })
        .catch(() => {
          messageApi.error(tError("TRY_AGAIN"));
          return;
        });
    }

    const indexItem: number = listItem.findIndex(
      (item: IAttributeChildTable) => item._id === record._id,
    );

    if (indexItem > -1) {
      const newItems: IAttributeChildTable[] = [...listItem];
      newItems[indexItem] = { ...record, public: false };
      setListItem(newItems);
    }

    if (listEdit[record._id]) {
      setListEdit({ ...listEdit, [record._id]: { ...record, public: false } });
    }
  };

  const onDeleteItem = async () => {
    if (!selectDelete) return;

    deleteChildAttribute(selectDelete._id)
      .then(() => {
        setModalDelete(false);
        setSelectDelete(null);
        getData();

        messageApi.success(tSuccess("delete"));
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
      });
  };

  const onRemoveItem = (record: IAttributeChildTable) => {
    const newListData: IAttributeChildTable[] = listItem.filter(
      (item) => item._id !== record._id,
    );
    const newListEdit = { ...listEdit };

    delete newListEdit[record._id];

    setListEdit(newListEdit);
    setListItem(newListData);
  };

  const onEdit = (record: IAttributeChildTable) => {
    const newListEdit = { ...listEdit, [record._id]: record };
    setListEdit(newListEdit);
  };

  const onCancel = (itemId: string) => {
    const newListEdit = { ...listEdit };
    delete newListEdit[itemId];

    setListEdit(newListEdit);
  };

  const onSave = async (
    attributeId: string,
    record: IAttributeChildTable,
    index: number,
  ) => {
    if (!attributeId) return;

    const newData: IAttributeChildTable = listEdit[record._id];

    if (!newData.title) {
      messageApi.error(tError("PLEASE_INPUT"));
      return;
    }

    const dataSend: INewAttributeChild = {
      name: newData.title,
      public: newData.public,
    };

    try {
      if (record._id.includes("new")) {
        await createChildAttribute(attributeId, dataSend);
        messageApi.success(tSuccess("create"));
        getData();
      } else {
        await updateChildAttribute(record._id, dataSend);
        messageApi.success(tSuccess("update"));

        const newListData: IAttributeChildTable[] = [...listItem];
        newListData[index] = newData;

        setListItem(newListData);
      }

      const newListEdit: {
        [x: string]: IAttributeChildTable;
      } = { ...listEdit };

      delete newListEdit[record._id];

      setListEdit(newListEdit);
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
  };

  const columns: TableColumnsType<IAttributeChildTable> = useMemo(() => {
    return [
      {
        title: t("table.title"),
        dataIndex: "title",
        className: "whitespace-nowrap",
        width: 300,
        align: "center",
        render: (value: string, record: IAttributeChildTable) => {
          if (!listEdit[record._id]) {
            return <span>{value ? value : tCommon("noData")}</span>;
          }

          return (
            <InputText
              width="w-full"
              value={listEdit[record._id].title || ""}
              placeholder={tError("PLEASE_INPUT")}
              error={!listEdit[record._id].title}
              onChange={(e) => onChangeValue(record, "title", e.target.value)}
            />
          );
        },
      },
      {
        title: t("table.status"),
        dataIndex: "public",
        className: "whitespace-nowrap",
        render: (isPublic: boolean, record: IAttributeChildTable) => (
          <Switch
            checked={isPublic}
            onClick={() => {
              if (isPublic) {
                onDisableItem(record);
              } else {
                onActiveItem(record);
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
              {date ? formatDate(date) : tCommon("noData")}
            </span>
          );
        },
      },
      {
        title: t("table.action"),
        dataIndex: "action",
        className: "whitespace-nowrap",
        align: "center",
        render: (_, record: IAttributeChildTable, index: number) => {
          return (
            <div className="flex items-center justify-center gap-2">
              <BtnDelete
                onClick={() => {
                  if (!record._id.includes("new")) {
                    setSelectDelete(record);
                    handlePopup();
                  } else {
                    onRemoveItem(record);
                  }
                }}
              />

              {!listEdit[record._id] && (
                <BtnEdit onClick={() => onEdit(record)} />
              )}

              {listEdit[record._id] && (
                <BtnCancel onClick={() => onCancel(record._id)} />
              )}

              {listEdit[record._id] && (
                <BtnCheck onClick={() => onSave(attributeId, record, index)} />
              )}
            </div>
          );
        },
      },
    ];
  }, [router.locale, listItem, listEdit]);

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
        footer={() => (
          <Button
            type="primary"
            size="large"
            icon={<CiCirclePlus className="text-3xl" />}
            onClick={onAddItem}>
            {t("create")}
          </Button>
        )}
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

export default AttributeChildTable;

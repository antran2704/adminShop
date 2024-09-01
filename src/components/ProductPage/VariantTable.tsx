import { useRouter } from "next/router";
import { Switch, TableColumnsType } from "antd";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { IProduct, IVariantProduct, IVariantTable } from "~/interface";

import { TableCore } from "../Core";
import { InputNumber, InputText } from "../Core/Input";
import { BtnDelete, BtnEdit, BtnCheck, BtnCancel } from "../Button";
import { ModalConfirm } from "../Modal";
import ImageCus from "../Image/ImageCus";

import { formatBigNumber } from "~/helper/format/number";
import {
  activeVariation,
  deleteVariation,
  disableVariation,
} from "~/api-client";

interface Props {
  product: IProduct;
  data: IVariantTable[];
  getData: () => void;
  handleChangeVariants: (items: IVariantProduct[]) => void;
}

const VariantTable = (props: Props) => {
  const { data, product, handleChangeVariants } = props;

  const router = useRouter();

  const t = useTranslations("ProductPage");
  const tCommon = useTranslations("Common");

  const [listItem, setListItem] = useState<IVariantTable[]>([]);
  const [listEditItem, setListEditItem] = useState<{
    [x: string]: IVariantTable;
  }>({});

  const [selectItem, setSelectItem] = useState<IVariantTable | null>(null);

  const [modal, setModal] = useState<{ changeImage: boolean; delete: boolean }>(
    {
      changeImage: false,
      delete: false,
    },
  );

  const [loading, setloading] = useState<{
    changeImage: boolean;
    delete: boolean;
  }>({
    changeImage: false,
    delete: false,
  });

  const onModal = (key: keyof typeof modal) => {
    if (modal[key]) {
      setSelectItem(null);
    }

    setModal({ ...modal, [key]: !modal[key] });
  };

  const onSelectImage = (variant: IVariantTable, url: string) => {
    const newListItem = { ...listEditItem };

    newListItem[variant._id] = { ...variant, thumbnail: url };
    setListEditItem(newListItem);
    onModal("changeImage");
  };

  const onEdit = (item: IVariantTable) => {
    const newListItem = { ...listEditItem, [item._id]: { ...item } };

    setListEditItem(newListItem);
  };

  const onSave = async (variantId: string, index: number) => {
    const newData: IVariantTable = { ...listEditItem[variantId] };
    const newListItem: IVariantTable[] = [...listItem];
    const newListEditItem = { ...listEditItem };

    newListItem[index] = newData;
    delete newListEditItem[variantId];

    setListItem(newListItem);
    setListEditItem(newListEditItem);
    handleChangeVariants(newListItem);
  };

  const onDelete = async (variantId: string) => {
    setloading({ ...loading, delete: true });

    const newListItem: IVariantTable[] = listItem.filter(
      (item) => variantId !== item._id,
    );
    const newListEditItem = { ...listEditItem };

    if (!variantId.includes("new")) {
      await deleteVariation(variantId);
    }

    if (newListEditItem[variantId]) {
      delete newListEditItem[variantId];
    }

    setListItem(newListItem);
    setListEditItem(newListEditItem);
    handleChangeVariants(newListItem);

    onModal("delete");
    setloading({ ...loading, delete: false });
  };

  const onCancelEdit = (variantId: string) => {
    const newListItem = { ...listEditItem };
    delete newListItem[variantId];

    setListEditItem({ ...newListItem });
  };

  const onChangeValue = (
    variant: IVariantTable,
    key: keyof IVariantTable,
    value: string | number,
  ) => {
    const newItems = { ...listEditItem };

    (newItems[variant._id][key] as any) = value;
    setListEditItem(newItems);
  };

  const onChangeStatus = async (
    variant: IVariantTable,
    index: number,
    value: boolean,
  ) => {
    const newItems: IVariantTable[] = [...listItem];

    if (!variant._id.includes("new")) {
      if (value) {
        await activeVariation(variant._id);
      } else {
        await disableVariation(variant._id);
      }
    }

    newItems[index] = { ...variant, public: value };
    setListItem(newItems);
  };

  const columns: TableColumnsType<IVariantTable> =
    useMemo((): TableColumnsType<IVariantTable> => {
      return [
        {
          title: t("table.thumbnail"),
          dataIndex: "thumbnail",
          width: 200,
          align: "center",
          render: (image: string, record: IVariantTable) => {
            return (
              <div>
                {!listEditItem[record._id] && (
                  <ImageCus
                    src={image}
                    title="banner thumbnail"
                    className="size-[120px] object-cover object-center rounded-md mx-auto"
                  />
                )}

                {listEditItem[record._id] && (
                  <div
                    onClick={() => {
                      setSelectItem(record);
                      onModal("changeImage");
                    }}>
                    <ImageCus
                      src={listEditItem[record._id].thumbnail as string}
                      title="banner thumbnail"
                      className="size-[120px] object-cover object-center cursor-pointer rounded-md mx-auto"
                    />
                  </div>
                )}

                {listEditItem[record._id] && (
                  <button
                    onClick={() => {
                      setSelectItem(record);
                      onModal("changeImage");
                    }}
                    className="text-sm hover:text-primary mt-2">
                    Change
                  </button>
                )}
              </div>
            );
          },
        },
        {
          title: t("table.title"),
          dataIndex: "title",
          className: "whitespace-nowrap",
          align: "center",
        },
        {
          title: t("table.price"),
          dataIndex: "price",
          className: "whitespace-nowrap",
          align: "center",
          width: 200,
          render: (value: number, record: IVariantTable) => {
            if (!listEditItem[record._id]) {
              return <span>{value ? formatBigNumber(value) : 0}</span>;
            }

            return (
              <InputNumber
                width="w-full"
                size="large"
                value={formatBigNumber(listEditItem[record._id].price)}
                onChangeValue={(value) => onChangeValue(record, "price", value)}
              />
            );
          },
        },
        {
          title: t("table.promotionPrice"),
          dataIndex: "promotion_price",
          className: "whitespace-nowrap",
          align: "center",
          width: 200,
          render: (value: number, record: IVariantTable) => {
            if (!listEditItem[record._id]) {
              return <span>{value ? formatBigNumber(value) : 0}</span>;
            }

            return (
              <InputNumber
                width="w-full"
                size="large"
                value={formatBigNumber(
                  listEditItem[record._id].promotion_price,
                )}
                onChangeValue={(value) =>
                  onChangeValue(record, "promotion_price", value)
                }
              />
            );
          },
        },
        {
          title: t("table.inventory"),
          dataIndex: "inventory",
          className: "whitespace-nowrap",
          align: "center",
          width: 200,
          render: (value: number, record: IVariantTable) => {
            if (!listEditItem[record._id]) {
              return <span>{value ? formatBigNumber(value) : 0}</span>;
            }

            return (
              <InputNumber
                width="w-full"
                size="large"
                value={formatBigNumber(listEditItem[record._id].inventory)}
                onChangeValue={(value) =>
                  onChangeValue(record, "inventory", value)
                }
              />
            );
          },
        },
        {
          title: t("table.sku"),
          dataIndex: "sku",
          className: "whitespace-nowrap",
          align: "center",
          width: 200,
          render: (value: string, record: IVariantTable) => {
            if (!listEditItem[record._id]) {
              return <span>{value ? value : tCommon("noData")}</span>;
            }

            return (
              <InputText
                width="w-full"
                value={listEditItem[record._id].sku || ""}
                placeholder="Sku..."
                onChange={(e) => onChangeValue(record, "sku", e.target.value)}
              />
            );
          },
        },
        {
          title: t("table.barcode"),
          dataIndex: "barcode",
          className: "whitespace-nowrap",
          align: "center",
          width: 200,
          render: (value: string, record: IVariantTable) => {
            if (!listEditItem[record._id]) {
              return <span>{value ? value : tCommon("noData")}</span>;
            }

            return (
              <InputText
                width="w-full"
                value={listEditItem[record._id].barcode || ""}
                placeholder="Barcode..."
                onChange={(e) =>
                  onChangeValue(record, "barcode", e.target.value)
                }
              />
            );
          },
        },
        {
          title: t("table.status"),
          dataIndex: "public",
          className: "whitespace-nowrap",
          width: 200,
          render: (
            isPublic: boolean,
            reccord: IVariantTable,
            index: number,
          ) => (
            <Switch
              checked={isPublic}
              onClick={(value) => {
                onChangeStatus(reccord, index, value);
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
          render: (_, record: IVariantTable, index: number) => {
            return (
              <div className="flex items-center justify-center gap-2">
                <BtnDelete
                  onClick={() => {
                    setSelectItem(record);
                    onModal("delete");
                  }}
                />

                {!listEditItem[record._id] && (
                  <BtnEdit onClick={() => onEdit(record)} />
                )}
                {listEditItem[record._id] && (
                  <BtnCancel onClick={() => onCancelEdit(record._id)} />
                )}
                {listEditItem[record._id] && (
                  <BtnCheck onClick={() => onSave(record._id, index)} />
                )}
              </div>
            );
          },
        },
      ];
    }, [router.locale, listItem, listEditItem]);

  useEffect(() => {
    setListItem(data);
  }, [data]);

  return (
    <Fragment>
      <TableCore
        dataSource={listItem}
        showPagination={false}
        columns={columns}
        scroll={{ x: 2000 }}
        size="large"
      />

      {/* Modal change image */}
      <ModalConfirm
        width={800}
        title="Change image"
        type="info"
        footer={null}
        open={modal.changeImage}
        onCancel={() => onModal("changeImage")}>
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 py-5 gap-5">
          {product.gallery.map((item: string, index: number) => (
            <div
              className="hover:border-primary border-2 rounded-md cursor-pointer overflow-hidden"
              onClick={() => selectItem && onSelectImage(selectItem, item)}
              key={index}>
              <img
                src={item}
                className="w-full h-full object-cover object-center"
                alt="product gallery"
              />
            </div>
          ))}
        </div>
      </ModalConfirm>

      {/* Modal delete */}
      <ModalConfirm
        title={t("modalDelete.title")}
        open={modal.delete}
        onCancel={() => onModal("delete")}
        centered
        type="error"
        destroyOnClose
        onOk={() => onDelete(selectItem?._id as string)}
        okButtonProps={{
          loading: loading.delete,
          disabled: loading.delete,
        }}>
        <img
          src="/popup/trash.svg"
          className="size-[200px] mx-auto"
          title="delete image"
          alt="delete image"
        />
        <p className="md:text-lg text-base text-center">
          {t("modalDelete.title")} <strong>{selectItem?.title}</strong>
        </p>
        <p className="text-base text-center mb-10">
          {t("modalDelete.description")}
        </p>
      </ModalConfirm>
    </Fragment>
  );
};

export default VariantTable;

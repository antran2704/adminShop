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

import { PATH_IMAGE } from "~/common/images";
import { formatBigNumber } from "~/helper/format/number";
import {
  activeVariation,
  deleteVariation,
  disableVariation,
  updateVariation,
} from "~/api-client";

interface Props {
  product: IProduct;
  data: IVariantTable[];
  loading?: boolean;
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

  const [modal, setModal] = useState<{ changeImage: boolean }>({
    changeImage: false,
  });

  const onModalImage = () => {
    if (modal.changeImage) {
      setSelectItem(null);
    }

    setModal({ ...modal, changeImage: !modal.changeImage });
  };

  const onSelectImage = (variant: IVariantTable, url: string) => {
    const newListItem = { ...listEditItem };

    newListItem[variant._id] = { ...variant, thumbnail: url };
    setListEditItem(newListItem);
    onModalImage();
  };

  const onEdit = (item: IVariantTable) => {
    const newListItem = { ...listEditItem, [item._id]: { ...item } };

    setListEditItem(newListItem);
  };

  const onSave = async (item: IVariantTable, index: number) => {
    const newData: IVariantTable = { ...listEditItem[item._id] };
    const newListItem: IVariantTable[] = [...listItem];
    const newListEditItem = { ...listEditItem };

    // if (!item._id.includes("new")) {
    //   const { _id, key, ...dataSend } = newData;
    //   await updateVariation(item._id, dataSend);
    // }

    newListItem[index] = newData;
    delete newListEditItem[item._id];

    setListItem(newListItem);
    setListEditItem(newListEditItem);
    handleChangeVariants(newListItem);
  };

  const onDelete = async (variant: IVariantTable) => {
    const newListItem: IVariantTable[] = listItem.filter(
      (item) => variant._id !== item._id,
    );
    const newListEditItem = { ...listEditItem };

    if (!variant._id.includes("new")) {
      await deleteVariation(variant._id);
    }

    if (newListEditItem[variant._id]) {
      delete newListEditItem[variant._id];
    }

    setListItem(newListItem);
    setListEditItem(newListEditItem);
    handleChangeVariants(newListItem);
  };

  const onCancelEdit = (item: IVariantTable) => {
    const newListItem = { ...listEditItem };
    delete newListItem[item._id];

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
                    src={PATH_IMAGE + image}
                    title="banner thumbnail"
                    className="size-[120px] object-cover object-center rounded-md mx-auto"
                  />
                )}

                {listEditItem[record._id] && (
                  <div
                    onClick={() => {
                      setSelectItem(record);
                      onModalImage();
                    }}>
                    <ImageCus
                      src={
                        (PATH_IMAGE as string) +
                        listEditItem[record._id].thumbnail
                      }
                      title="banner thumbnail"
                      className="size-[120px] object-cover object-center cursor-pointer rounded-md mx-auto"
                    />
                  </div>
                )}

                {listEditItem[record._id] && (
                  <button
                    onClick={() => {
                      setSelectItem(record);
                      onModalImage();
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
                <BtnDelete onClick={() => onDelete(record)} />

                {!listEditItem[record._id] && (
                  <BtnEdit onClick={() => onEdit(record)} />
                )}
                {listEditItem[record._id] && (
                  <BtnCheck onClick={() => onSave(record, index)} />
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
        //   loading={loading}
        showPagination={false}
        columns={columns}
        scroll={{ x: 2000 }}
        size="large"
      />

      <ModalConfirm
        width={800}
        title="Change image"
        type="info"
        footer={null}
        open={modal.changeImage}
        onCancel={onModalImage}>
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 py-5 gap-5">
          {product.gallery.map((item: string, index: number) => (
            <div
              className="hover:border-primary border-2 rounded-md cursor-pointer overflow-hidden"
              onClick={() => selectItem && onSelectImage(selectItem, item)}
              key={index}>
              <img
                src={PATH_IMAGE + item}
                className="w-full h-full object-cover object-center"
                alt="product gallery"
              />
            </div>
          ))}
        </div>
      </ModalConfirm>
    </Fragment>
  );
};

export default VariantTable;

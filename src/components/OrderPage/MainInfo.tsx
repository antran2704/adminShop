import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import {
  ENUM_ORDER_CANCEL,
  ENUM_ORDER_STATUS,
  ENUM_PAYMENT_METHOD,
} from "~/enums/order";
import { formatDate } from "~/helper/format/datetime";
import { IOrder } from "~/interface/order";
import { SelectFilterCore } from "../Core";
import { DefaultOptionType } from "antd/es/select";
import { ModalConfirm } from "../Modal";
import { cancelOrder, updateStatusOrder } from "~/api-client";
import { message, Radio, RadioChangeEvent } from "antd";
import { InputTextArea } from "../Core/Input";

interface Props {
  data: IOrder;
  getData: () => void;
}

const MainInfoOrder = (props: Props) => {
  const { data, getData } = props;

  const t = useTranslations("OrderPage");
  const tError = useTranslations("Error");
  const tSuccess = useTranslations("Success");

  const router = useRouter();

  const [cancel, setCancel] = useState<ENUM_ORDER_CANCEL | null>(null);
  const [cancelNote, setCancelNote] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    process: boolean;
    shipping: boolean;
    success: boolean;
    cancel: boolean;
  }>({
    process: false,
    cancel: false,
    shipping: false,
    success: false,
  });

  const [loading, setLoading] = useState<{
    process: boolean;
    shipping: boolean;
    success: boolean;
    cancel: boolean;
  }>({
    process: false,
    cancel: false,
    shipping: false,
    success: false,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const isDisableBtnCancel: boolean = useMemo(() => {
    return (
      !cancel ||
      (cancel === ENUM_ORDER_CANCEL.OTHER && !cancelNote) ||
      loading.cancel
    );
  }, [router.locale, cancel, cancelNote, loading.cancel]);

  const status: { color: string; title: string } = useMemo(() => {
    let color: string;
    let title: string;

    switch (data.order_status) {
      case ENUM_ORDER_STATUS.PENDING:
        color = "bg-warn";
        title = t("orderStatus.pending");
        break;

      case ENUM_ORDER_STATUS.PROCESS:
        color = "bg-primary";
        title = t("orderStatus.process");
        break;

      case ENUM_ORDER_STATUS.SUCCESS:
        color = "bg-success";
        title = t("orderStatus.success");
        break;

      case ENUM_ORDER_STATUS.SHIPPING:
        color = "bg-[#5856d6]";
        title = t("orderStatus.shipping");
        break;

      case ENUM_ORDER_STATUS.CANCEL:
        color = "bg-error";
        title = t("orderStatus.cancel");
        break;
    }

    return { color, title };
  }, [router.locale, data]);

  const optionStatus: DefaultOptionType[] = useMemo((): DefaultOptionType[] => {
    switch (data.order_status) {
      case ENUM_ORDER_STATUS.PENDING:
        return [
          { label: t("orderStatus.process"), value: ENUM_ORDER_STATUS.PROCESS },
          { label: t("orderStatus.cancel"), value: ENUM_ORDER_STATUS.CANCEL },
        ];

      case ENUM_ORDER_STATUS.PROCESS:
        return [
          {
            label: t("orderStatus.shipping"),
            value: ENUM_ORDER_STATUS.SHIPPING,
          },
          { label: t("orderStatus.cancel"), value: ENUM_ORDER_STATUS.CANCEL },
        ];

      case ENUM_ORDER_STATUS.SHIPPING:
        return [
          {
            label: t("orderStatus.success"),
            value: ENUM_ORDER_STATUS.SUCCESS,
          },
        ];

      default:
        return [];
    }
  }, [router.locale, data]);

  const optionCancel: DefaultOptionType[] = useMemo(
    (): DefaultOptionType[] => [
      {
        value: ENUM_ORDER_CANCEL.OUT_OF_STOCK,
        label: t("modalCancel.outOfStock"),
      },
      {
        value: ENUM_ORDER_CANCEL.OTHER,
        label: t("modalCancel.other"),
      },
    ],
    [router.locale, data],
  );

  const onChangeOptionCancel = (e: RadioChangeEvent) => {
    const value: ENUM_ORDER_CANCEL = e.target.value;
    setCancel(value);
  };

  const onChangeCancelNote = (value: string) => {
    setCancelNote(value);
  };

  const onResetCancel = () => {
    setCancel(null);
    setCancelNote(null);
  };

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const onChangeOption = (value: ENUM_ORDER_STATUS) => {
    switch (value) {
      case ENUM_ORDER_STATUS.PROCESS:
        onModal("process", true);
        break;

      case ENUM_ORDER_STATUS.SHIPPING:
        onModal("shipping", true);
        break;

      case ENUM_ORDER_STATUS.SUCCESS:
        onModal("success", true);
        break;

      case ENUM_ORDER_STATUS.CANCEL:
        onModal("cancel", true);
        break;
    }
  };

  const onProcess = async () => {
    onLoading("process", true);

    await updateStatusOrder(data.order_id, ENUM_ORDER_STATUS.PROCESS)
      .then(() => {
        messageApi.success(tSuccess("update"));

        onModal("process", false);
        getData();
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
      });

    onLoading("process", false);
  };

  const onShipping = async () => {
    onLoading("shipping", true);

    await updateStatusOrder(data.order_id, ENUM_ORDER_STATUS.SHIPPING)
      .then(() => {
        messageApi.success(tSuccess("update"));

        onModal("shipping", false);
        getData();
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
      });

    onLoading("shipping", false);
  };

  const onSuccess = async () => {
    onLoading("success", true);

    await updateStatusOrder(data.order_id, ENUM_ORDER_STATUS.SUCCESS)
      .then(() => {
        messageApi.success(tSuccess("update"));

        onModal("success", false);
        getData();
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
      });

    onLoading("success", false);
  };

  const onCancel = async () => {
    onLoading("cancel", true);

    if (!cancel || (cancel === ENUM_ORDER_CANCEL.OTHER && !cancelNote)) return;

    await cancelOrder(data.order_id, {
      status: ENUM_ORDER_STATUS.CANCEL,
      optionCancel: cancel,
      note: cancelNote,
    })
      .then(() => {
        messageApi.success(tSuccess("update"));

        onModal("cancel", false);
        onResetCancel();
        getData();
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
      });

    onLoading("cancel", false);
  };

  return (
    <div className="p-5 bg-[#f9fafb] border-2 rounded-lg">
      <h2 className="lg:text-xl md:text-lg text-base text-primary font-medium pb-1 mb-2 border-b">
        {t("mainInfo.title")}
      </h2>

      <div className="flex items-start justify-between gap-10">
        <ul>
          <li className="flex items-center justify-start text-base mt-1 gap-1">
            <h3 className="capitalize">{t("mainInfo.orderId")}:</h3>
            <p className="font-medium">{data.order_id}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="capitalize">{t("mainInfo.customerName")}:</h3>
            <p className="font-medium">{data.address.shipping_name}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="capitalize">{t("mainInfo.phone")}:</h3>
            <Link
              href={`tel:${data.address.shipping_phone}`}
              className="font-medium text-primary hover:underline">
              {data.address.shipping_phone}
            </Link>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="capitalize">{t("mainInfo.email")}:</h3>
            <Link
              href={`mailto:${data.address.shipping_email}`}
              className="font-medium text-primary hover:underline">
              {data.address.shipping_email}
            </Link>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="capitalize">{t("mainInfo.address")}:</h3>
            <p className="font-medium ">{data.address.shipping_address}</p>
          </li>
        </ul>

        <ul>
          <li className="flex items-center text-base mt-1 gap-1">
            <h3 className="capitalize">{t("mainInfo.paymentMethod")}:</h3>
            <p className="font-medium">
              {data.payment_method === ENUM_PAYMENT_METHOD.COD &&
                t("paymentMethod.cod")}
              {data.payment_method === ENUM_PAYMENT_METHOD.BANKING &&
                t("paymentMethod.banking")}
              {data.payment_method === ENUM_PAYMENT_METHOD.CASH &&
                t("paymentMethod.cash")}
              {data.payment_method === ENUM_PAYMENT_METHOD.CARD &&
                t("paymentMethod.card")}
              {data.payment_method === ENUM_PAYMENT_METHOD.VNPAY &&
                t("paymentMethod.vnPay")}
            </p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="capitalize">{t("mainInfo.createdAt")}:</h3>
            <p>{formatDate(data.createdAt)}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="capitalize">{t("mainInfo.updatedAt")}:</h3>
            <p>{formatDate(data.updatedAt)}</p>
          </li>
          {!!optionStatus.length && (
            <li className="flex items-center flex-wrap text-base mt-2 gap-2">
              <h3 className="capitalize">{t("mainInfo.status")}:</h3>
              <SelectFilterCore
                options={optionStatus}
                value={status.title}
                onChange={onChangeOption}
              />
            </li>
          )}
          {data.cancel.content && (
            <li className="flex items-start flex-wrap text-base mt-1 gap-1">
              <h3 className="capitalize">{t("mainInfo.reason")}:</h3>
              <p>
                {data.cancel.content === ENUM_ORDER_CANCEL.OUT_OF_STOCK &&
                  t("modalCancel.outOfStock")}
                {data.cancel.content === ENUM_ORDER_CANCEL.OTHER &&
                  t("modalCancel.other")}
              </p>
            </li>
          )}
          {data.cancel.note && (
            <li className="flex items-start flex-wrap text-base mt-1 gap-1">
              <h3 className="capitalize">{t("mainInfo.noteCancel")}:</h3>
              <p>{data.cancel.note}</p>
            </li>
          )}
        </ul>
      </div>

      {/* Modal process */}
      <ModalConfirm
        title={t("modalProcess.title")}
        open={modal.process}
        onCancel={() => onModal("process", false)}
        centered
        type="info"
        okButtonProps={{
          loading: loading.process,
          disabled: loading.process,
        }}
        destroyOnClose
        onOk={onProcess}>
        <p className="md:text-lg text-base text-center mb-10">
          {t("modalProcess.description")}
        </p>
      </ModalConfirm>

      {/* Modal shipping */}
      <ModalConfirm
        title={t("modalShipping.title")}
        open={modal.shipping}
        onCancel={() => onModal("shipping", false)}
        centered
        type="info"
        destroyOnClose
        okButtonProps={{
          loading: loading.shipping,
          disabled: loading.shipping,
        }}
        onOk={onShipping}>
        <p className="md:text-lg text-base text-center mb-10">
          {t("modalShipping.description")}
        </p>
      </ModalConfirm>

      {/* Modal success */}
      <ModalConfirm
        title={t("modalSuccess.title")}
        open={modal.success}
        onCancel={() => onModal("success", false)}
        centered
        type="info"
        destroyOnClose
        okButtonProps={{
          loading: loading.success,
          disabled: loading.success,
        }}
        onOk={onSuccess}>
        <p className="md:text-lg text-base text-center mb-10">
          {t("modalSuccess.description")}
        </p>
      </ModalConfirm>

      {/* Modal cancel */}
      <ModalConfirm
        title={t("modalCancel.title")}
        open={modal.cancel}
        onCancel={() => {
          onModal("cancel", false);
          onResetCancel();
        }}
        centered
        type="error"
        destroyOnClose
        okButtonProps={{
          loading: loading.cancel,
          disabled: isDisableBtnCancel,
        }}
        onOk={onCancel}>
        <div>
          <p className="text-base mb-2">{t("modalCancel.selectTitle")}</p>
          <Radio.Group
            onChange={onChangeOptionCancel}
            value={cancel}
            className="flex flex-col">
            {optionCancel.map((option: DefaultOptionType, index: number) => (
              <Radio key={index} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
          {cancel === ENUM_ORDER_CANCEL.OTHER && (
            <InputTextArea
              className="mt-2"
              rows={4}
              value={cancelNote || ""}
              placeholder={tError("PLEASE_INPUT")}
              onChange={(e) => onChangeCancelNote(e.target.value)}
            />
          )}
        </div>
      </ModalConfirm>

      {/* Message of antd */}
      {contextHolder}
    </div>
  );
};

export default MainInfoOrder;

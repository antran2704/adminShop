import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { ENUM_ORDER_STATUS, ENUM_PAYMENT_METHOD } from "~/enums/order";
import { formatDate } from "~/helper/format/datetime";
import { IOrder } from "~/interface/order";
import { SelectFilterCore } from "../Core";
import { DefaultOptionType } from "antd/es/select";
import { ModalConfirm } from "../Modal";
import { updateOrder } from "~/api-client";
import { message } from "antd";

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

    await updateOrder(data.order_id, ENUM_ORDER_STATUS.PROCESS)
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

    await updateOrder(data.order_id, ENUM_ORDER_STATUS.SHIPPING)
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

    await updateOrder(data.order_id, ENUM_ORDER_STATUS.SUCCESS)
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
          <li className="flex items-center flex-wrap text-base mt-2 gap-1">
            <h3 className="capitalize">{t("mainInfo.status")}:</h3>

            {!!optionStatus.length && (
              <SelectFilterCore
                options={optionStatus}
                value={status.title}
                onChange={onChangeOption}
              />
            )}
            {!optionStatus.length && (
              <p
                className={clsx(
                  "w-fit font-medium text-white text-xs capitalize px-5 py-2 rounded-md",
                  [status.color],
                )}>
                {status.title}
              </p>
            )}
          </li>
        </ul>
      </div>

      {/* {data.payment_status === PaymentStatus.success && (
        <div>
          {data.status === statusOrder.cancle && (
            <Fragment>
              <li className="flex items-start justify-start text-base mt-1 gap-1">
                <h3 className="font-medium capitalize">
                  Why:
                </h3>
                <p
                  className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}>
                  {data.cancleContent || "updating"}
                </p>
              </li>
              {data.note && (
                <li className="flex items-start justify-start text-base mt-1 gap-1">
                  <h3 className="font-medium capitalize">
                    Note:
                  </h3>
                  <p
                    className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}>
                    {data.note}
                  </p>
                </li>
              )}
            </Fragment>
          )}

          {data.status === statusOrder.pending && (
            <li className="flex items-center justify-start mt-5 text-base gap-1">
              <h3 className="font-medium capitalize">
                Change Status:
              </h3>
              <div className="flex items-center gap-3">
                <ButtonClassic
                  title="Processing"
                  size="S"
                  handleClick={onShowProcessing}
                  className="bg-primary"
                />
                <ButtonClassic
                  title="Cancle"
                  size="S"
                  handleClick={onShowCancle}
                  className="bg-cancle"
                />
              </div>
            </li>
          )}

          {data.status === statusOrder.processing && (
            <li className="flex items-center justify-start mt-5 text-base gap-1">
              <h3 className="font-medium capitalize">
                Change Status:
              </h3>
              <div className="flex items-center gap-3">
                <ButtonClassic
                  title="Delivered"
                  size="S"
                  handleClick={onShowDelivered}
                  className="bg-success"
                />
                <ButtonClassic
                  title="Cancle"
                  size="S"
                  handleClick={onShowCancle}
                  className="bg-cancle"
                />
              </div>
            </li>
          )}
        </div>
      )} */}

      {/* {data.payment_status !== PaymentStatus.success && (
        <div>
          {data.status === statusOrder.cancle && (
            <Fragment>
              <li className="flex items-start justify-start text-base mt-1 gap-1">
                <h3 className="font-medium capitalize">
                  Why:
                </h3>
                <p
                  className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}>
                  {data.cancleContent || "updating"}
                </p>
              </li>
              {data.note && (
                <li className="flex items-start justify-start text-base mt-1 gap-1">
                  <h3 className="font-medium capitalize">
                    Note:
                  </h3>
                  <p
                    className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}>
                    {data.note}
                  </p>
                </li>
              )}
            </Fragment>
          )}

          {data.status === statusOrder.pending && (
            <li className="flex items-center justify-start mt-5 text-base gap-1">
              <h3 className="font-medium capitalize">
                Confirm banking:
              </h3>
              <div className="flex items-center gap-3">
                <ButtonClassic
                  title="Confirm"
                  size="S"
                  handleClick={onShowConfirmBanking}
                  className="bg-success"
                />
                <ButtonClassic
                  title="Cancle"
                  size="S"
                  handleClick={onShowCancle}
                  className="bg-cancle"
                />
              </div>
            </li>
          )}
        </div>
      )} */}

      {/* {showConfirmBanking && (
        <Popup
          show={showConfirmBanking}
          title="Xác nhận đã chuyển khoản"
          onClose={onShowConfirmBanking}>
          <div className="flex items-center justify-between">
            <ButtonClassic
              title="Cancle"
              size="S"
              handleClick={onShowConfirmBanking}
              className="bg-error"
            />

            <ButtonClassic
              title="Accept"
              size="S"
              handleClick={() => {
                onShowConfirmBanking();
                hanldeChangePaymentStatus(PaymentStatus.success);
              }}
              className="bg-success text-white opacity-80 hover:opacity-100"
            />
          </div>
        </Popup>
      )} */}

      {/* {showCancle && data?.payment_status === PaymentStatus.success && (
        <Popup show={showCancle} title="Lý do hủy đơn" onClose={onShowCancle}>
          <div className="mx-auto">
            <fieldset>
              <legend className="sr-only">Countries</legend>

              {optionsCancle.map((option: IOptionCancle) => (
                <div key={option.id} className="flex items-center mb-4">
                  <input
                    id={option.id}
                    type="radio"
                    name="options"
                    onChange={(e) => onChooseOption(e)}
                    value={option.value}
                    className="h-4 w-4 border-gray-300"
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium text-gray-900  ml-2 block">
                    {option.lable}
                  </label>
                </div>
              ))}
            </fieldset>

            <div className="my-4">
              <h3 className="text-base mb-2">Note</h3>
              <textarea
                ref={noteRef}
                className="w-full px-3 py-2 rounded-md border-2"
                name="note_option"
                id="note_option"
                cols={30}
                rows={4}
                placeholder="Enter note..."></textarea>
            </div>

            <div className="flex items-center justify-between">
              <ButtonClassic
                title="Cancle"
                size="S"
                handleClick={onShowCancle}
                className="bg-error"
              />

              <ButtonClassic
                title="Accept"
                disable={disableBtnCancle}
                size="S"
                handleClick={() => {
                  onShowCancle();
                  hanldeChangeStatus(statusOrder.cancle);
                }}
                className="bg-success"
              />
            </div>
          </div>
        </Popup>
      )} */}

      {/* {showCancle && data?.payment_status !== PaymentStatus.success && (
        <Popup show={showCancle} title="Lý do hủy đơn" onClose={onShowCancle}>
          <div className="mx-auto">
            <fieldset>
              <legend className="sr-only">Countries</legend>

              {optionsCancleByPayment.map((option: IOptionCancle) => (
                <div key={option.id} className="flex items-center mb-4">
                  <input
                    id={option.id}
                    type="radio"
                    name="options"
                    onChange={(e) => onChooseOption(e)}
                    value={option.value}
                    className="h-4 w-4 border-gray-300"
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium text-gray-900 ml-2 block">
                    {option.lable}
                  </label>
                </div>
              ))}
            </fieldset>

            <div className="my-4">
              <h3 className="text-base mb-2">Note</h3>
              <textarea
                ref={noteRef}
                className="w-full px-3 py-2 rounded-md border-2"
                name="note_option"
                id="note_option"
                cols={30}
                rows={4}
                placeholder="Enter note..."></textarea>
            </div>

            <div className="flex items-center justify-between">
              <ButtonClassic
                title="Cancle"
                size="S"
                handleClick={onShowCancle}
                className="bg-error"
              />

              <ButtonClassic
                title="Accept"
                disable={disableBtnCancle}
                size="S"
                handleClick={() => {
                  onShowCancle();
                  hanldeChangeStatus(statusOrder.cancle);
                }}
                className={`${disableBtnCancle ? "bg-[#d1d6e2]" : "bg-success"}`}
              />
            </div>
          </div>
        </Popup>
      )} */}
      {/* {showDelivered && (
        <Popup
          title="Bạn có muốn hoàn thành đơn hàng này"
          show={showDelivered}
          onClose={onShowDelivered}>
          <div className="flex items-center justify-between">
            <ButtonClassic
              title="Cancle"
              size="S"
              handleClick={onShowDelivered}
              className="bg-error"
            />

            <ButtonClassic
              title="Accept"
              size="S"
              handleClick={() => {
                onShowDelivered();
                hanldeChangeStatus(statusOrder.delivered);
              }}
              className="bg-success text-white opacity-80 hover:opacity-100"
            />
          </div>
        </Popup>
      )} */}
      {/* {showProcessing && (
        <Popup
          title="Đang chuẩn bị đơn hàng"
          show={showProcessing}
          onClose={onShowProcessing}>
          <div className="flex items-center justify-between">
            <ButtonClassic
              title="Cancle"
              size="S"
              handleClick={onShowProcessing}
              className="bg-error"
            />

            <ButtonClassic
              title="Accept"
              size="S"
              handleClick={() => {
                onShowProcessing();
                hanldeChangeStatus(statusOrder.processing);
              }}
              className="bg-success text-white opacity-80 hover:opacity-100"
            />
          </div>
        </Popup>
      )} */}

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

      {/* Message of antd */}
      {contextHolder}
    </div>
  );
};

export default MainInfoOrder;

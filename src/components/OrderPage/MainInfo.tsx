import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { ENUM_ORDER_STATUS } from "~/enums/order";
import { formatDate } from "~/helper/format/datetime";
import { IOrder } from "~/interface/order";

interface Props {
  data: IOrder;
}

const MainInfoOrder = (props: Props) => {
  const { data } = props;

  const t = useTranslations("OrderPage");
  const router = useRouter();

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

  return (
    <ul className="py-5">
      <h2 className="md:text-lg text-base dark:text-darkText text-primary font-medium">
        {t("mainInfo.title")}
      </h2>
      <li className="flex items-center justify-start text-base mt-1 gap-1">
        <h3 className="font-medium capitalize dark:text-darkText">
          {t("mainInfo.orderId")}:
        </h3>
        <p className="text-[#707275] dark:text-darkText">{data.order_id}</p>
      </li>
      <li className="flex items-start justify-start text-base mt-1 gap-1">
        <h3 className="font-medium capitalize dark:text-darkText">
          {t("mainInfo.customerName")}:
        </h3>
        <p className="text-[#707275] dark:text-darkText">
          {data.address.shipping_name}
        </p>
      </li>
      <li className="flex items-start justify-start text-base mt-1 gap-1">
        <h3 className="font-medium capitalize dark:text-darkText">
          {t("mainInfo.phone")}:
        </h3>
        <Link
          href={`tel:${data.address.shipping_phone}`}
          className="text-primary hover:underline">
          {data.address.shipping_phone}
        </Link>
      </li>
      <li className="flex items-start justify-start text-base mt-1 gap-1">
        <h3 className="font-medium capitalize dark:text-darkText">
          {t("mainInfo.email")}:
        </h3>
        <Link
          href={`mailto:${data.address.shipping_email}`}
          className="text-primary hover:underline">
          {data.address.shipping_email}
        </Link>
      </li>
      <li className="flex items-start justify-start text-base mt-1 gap-1">
        <h3 className="font-medium capitalize dark:text-darkText">
          {t("mainInfo.address")}:
        </h3>
        <p className="text-[#707275] dark:text-darkText">
          {data.address.shipping_address}
        </p>
      </li>
      <li className="flex items-start justify-start text-base mt-1 gap-1">
        <h3 className="font-medium capitalize dark:text-darkText">
          {t("mainInfo.createdAt")}:
        </h3>
        <p className="text-[#707275] dark:text-darkText">
          {formatDate(data.createdAt)}
        </p>
      </li>
      <li className="flex items-start justify-start text-base mt-1 gap-1">
        <h3 className="font-medium capitalize dark:text-darkText">
          {t("mainInfo.updatedAt")}:
        </h3>
        <p className="text-[#707275] dark:text-darkText">
          {formatDate(data.updatedAt)}
        </p>
      </li>
      <li className="flex items-start justify-start text-base mt-2 gap-1">
        <h3 className="font-medium capitalize dark:text-darkText">
          {t("mainInfo.status")}:
        </h3>
        <p
          className={clsx(
            "w-fit font-medium text-white text-xs capitalize px-5 py-2 rounded-md",
            [status.color],
          )}>
          {status.title}
        </p>
      </li>

      {/* {data.payment_status === PaymentStatus.success && (
        <div>
          {data.status === statusOrder.cancle && (
            <Fragment>
              <li className="flex items-start justify-start text-base mt-1 gap-1">
                <h3 className="font-medium capitalize dark:text-darkText">
                  Why:
                </h3>
                <p
                  className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}>
                  {data.cancleContent || "updating"}
                </p>
              </li>
              {data.note && (
                <li className="flex items-start justify-start text-base mt-1 gap-1">
                  <h3 className="font-medium capitalize dark:text-darkText">
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
              <h3 className="font-medium capitalize dark:text-darkText">
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
              <h3 className="font-medium capitalize dark:text-darkText">
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
                <h3 className="font-medium capitalize dark:text-darkText">
                  Why:
                </h3>
                <p
                  className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}>
                  {data.cancleContent || "updating"}
                </p>
              </li>
              {data.note && (
                <li className="flex items-start justify-start text-base mt-1 gap-1">
                  <h3 className="font-medium capitalize dark:text-darkText">
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
              <h3 className="font-medium capitalize dark:text-darkText">
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
                    className="text-sm font-medium text-gray-900 dark:text-darkText  ml-2 block">
                    {option.lable}
                  </label>
                </div>
              ))}
            </fieldset>

            <div className="my-4">
              <h3 className="text-base dark:text-darkText mb-2">Note</h3>
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
                    className="text-sm font-medium text-gray-900 dark:text-darkText ml-2 block">
                    {option.lable}
                  </label>
                </div>
              ))}
            </fieldset>

            <div className="my-4">
              <h3 className="text-base dark:text-darkText mb-2">Note</h3>
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
    </ul>
  );
};

export default MainInfoOrder;

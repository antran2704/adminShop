import clsx from "clsx";
import { useTranslations } from "next-intl";
import { MdPayment, MdOutlineLocalShipping, MdCancel } from "react-icons/md";
import { FaCheckCircle, FaBox } from "react-icons/fa";
import { RiBillLine } from "react-icons/ri";

import { ENUM_ORDER_PROCESS } from "~/enums/order";
import { formatDate } from "~/helper/format/datetime";
import { IProcessingOrder } from "~/interface/order";

interface Props {
  data: IProcessingOrder[];
}

const OrderProcess = (props: Props) => {
  const { data } = props;

  const t = useTranslations("OrderPage");

  return (
    <div className="w-full h-full">
      <h2 className="lg:text-xl md:text-lg text-base text-primary font-medium pb-1 mb-4 border-b">
        {t("process.title")}
      </h2>
      <div className="relative flex flex-col-reverse gap-10">
        {data.map((item: IProcessingOrder, index: number) => (
          <div key={item._id} className="relative flex items-start gap-5 z-[1]">
            <div
              className={clsx(
                "flex items-center justify-center bg-white p-2 rounded-full",
                [
                  index === data.length - 1
                    ? " border text-success border-success"
                    : "text-neutral-400",
                  item.label === ENUM_ORDER_PROCESS.CANCEL_TIME &&
                    "!text-error !border-error",
                ],
              )}>
              {item.label === ENUM_ORDER_PROCESS.ORDER_TIME && (
                <RiBillLine className={clsx("size-6 min-w-6")} />
              )}
              {item.label === ENUM_ORDER_PROCESS.PROCESS_TIME && (
                <FaBox className={clsx("size-6 min-w-6")} />
              )}
              {item.label === ENUM_ORDER_PROCESS.COMPLETED_TIME && (
                <FaCheckCircle className={clsx("size-6 min-w-6")} />
              )}
              {item.label === ENUM_ORDER_PROCESS.PAYMENT_TIME && (
                <MdPayment className={clsx("size-6 min-w-6")} />
              )}
              {item.label === ENUM_ORDER_PROCESS.SHIP_TIME && (
                <MdOutlineLocalShipping className={clsx("size-6 min-w-6")} />
              )}
              {item.label === ENUM_ORDER_PROCESS.CANCEL_TIME && (
                <MdCancel className={clsx("size-6 min-w-6")} />
              )}
            </div>
            <div
              className={clsx([
                index === data.length - 1 ? "text-success" : "text-neutral-400",
                item.label === ENUM_ORDER_PROCESS.CANCEL_TIME && "!text-error",
              ])}>
              <h4 className="font-medium">
                {item.label === ENUM_ORDER_PROCESS.ORDER_TIME &&
                  t("process.createdOrder")}
                {item.label === ENUM_ORDER_PROCESS.PAYMENT_TIME &&
                  t("process.payment")}
                {item.label === ENUM_ORDER_PROCESS.PROCESS_TIME &&
                  t("process.inProcess")}
                {item.label === ENUM_ORDER_PROCESS.SHIP_TIME &&
                  t("process.ship")}
                {item.label === ENUM_ORDER_PROCESS.COMPLETED_TIME &&
                  t("process.success")}
                {item.label === ENUM_ORDER_PROCESS.CANCEL_TIME &&
                  t("process.cancel")}
              </h4>
              <p className="text-xs">{formatDate(item.value)}</p>
            </div>
          </div>
        ))}

        <div className="absolute left-5 top-0 bottom-0 border border-black border-dashed z-0"></div>
      </div>
    </div>
  );
};

export default OrderProcess;

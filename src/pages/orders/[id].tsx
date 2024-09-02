import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  ReactElement,
  useMemo,
} from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { useTranslations } from "next-intl";
import { Button } from "antd";
import clsx from "clsx";

import { IItemOrder, IOrder, IOrderDetailTable } from "~/interface/order";
import { IResponse } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import { getOrder, updateOrder, updatePaymentStatusOrder } from "~/api-client";

import Loading from "~/components/Loading";
import { PrivateLayout } from "~/layouts";
import {
  MainInfoOrder,
  OrderDetailTable,
  OrderProcess,
} from "~/components/OrderPage";

import { formatBigNumber } from "~/helper/format/number";
import CURRENCY from "~/common/currency";
import FormFooter from "~/components/Footer/FormFooter";

const PDFDocument = dynamic(() => import("~/components/PDFDocument/index"), {
  loading: () => <Loading />,
  ssr: false,
});

const Layout = PrivateLayout;

const OrderDetail: NextPageWithLayout = () => {
  const t = useTranslations("OrderPage");
  const tCommon = useTranslations("Common");

  const router: NextRouter = useRouter();
  const orderId = router.query.id;

  const noteRef = useRef<HTMLTextAreaElement>(null);

  const [order, setOrder] = useState<IOrder | null>(null);
  const [orderTable, setOrderTable] = useState<IOrderDetailTable[]>([]);

  const [cancle, setCancle] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [showPrint, setShowPrint] = useState<boolean>(false);
  const [showCancle, setShowCancle] = useState<boolean>(false);
  const [showDelivered, setShowDelivered] = useState<boolean>(false);
  const [showProcessing, setShowProcessing] = useState<boolean>(false);
  const [showConfirmBanking, setShowConfirmBanking] = useState<boolean>(false);
  const [disableBtnCancle, setDisableBtn] = useState<boolean>(true);

  const currency = useMemo(() => {
    return CURRENCY[router.locale as keyof typeof CURRENCY];
  }, [router.locale]);

  const onShowCancle = useCallback(() => {
    setShowCancle(!showCancle);
    setCancle(null);
    setDisableBtn(true);
  }, [showCancle]);

  const onShowDelivered = useCallback(() => {
    setShowDelivered(!showDelivered);
  }, [showDelivered]);

  const onShowProcessing = useCallback(() => {
    setShowProcessing(!showProcessing);
  }, [showProcessing]);

  const onShowConfirmBanking = useCallback(() => {
    setShowConfirmBanking(!showConfirmBanking);
  }, [showConfirmBanking]);

  const onShow = (
    value: boolean,
    setValue: Dispatch<SetStateAction<boolean>>,
  ) => {
    setValue(!value);
  };

  const onChooseOption = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const value: string = e.target.value;
      setCancle(value);
      setDisableBtn(false);
    },
    [cancle, disableBtnCancle],
  );

  const hanldeChangePaymentStatus = async (status: PaymentStatus) => {
    setLoading(true);

    try {
      let payload;

      if (status === PaymentStatus.cancle) {
        payload = await updatePaymentStatusOrder(orderId as string, status, {
          note: noteRef.current ? noteRef.current.value : null,
          cancleContent: cancle,
        });
      }

      if (status === PaymentStatus.success) {
        payload = await updatePaymentStatusOrder(orderId as string, status);
      }

      if (payload.status === 201) {
        toast.success("Success change status payment order", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setLoading(false);
        getDataOrder(orderId as string);
      }
    } catch (error) {
      toast.error("Error change status order", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const hanldeChangeStatus = async (status: statusOrder) => {
    setLoading(true);

    try {
      let payload;

      if (status === statusOrder.processing) {
        payload = await updateOrder(orderId as string, statusOrder.processing);
      }

      if (status === statusOrder.cancle) {
        payload = await updateOrder(orderId as string, statusOrder.cancle, {
          note: noteRef.current ? noteRef.current.value : null,
          cancleContent: cancle,
        });
      }

      if (status === statusOrder.delivered) {
        payload = await updateOrder(orderId as string, statusOrder.delivered);
      }

      if (payload.status === 201) {
        toast.success("Success change status order", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setLoading(false);
        getDataOrder(orderId as string);
      }
    } catch (error) {
      toast.error("Error change status order", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  const getData = async (id: string) => {
    setLoading(true);

    await getOrder(id)
      .then(({ payload }: IResponse<IOrder>) => {
        const dataTable: IOrderDetailTable[] = payload.items.map(
          (item: IItemOrder, index: number) => ({
            key: item._id,
            id: item.product_id,
            orderNumber: index + 1,
            productName: item.model_name,
            price: item.price,
            promotionPrice: item.promotion_price,
            thumbnail: item.image,
            quantity: item.quantity,
            total: !!item.promotion_price
              ? item.quantity * item.promotion_price
              : item.quantity * item.price,
          }),
        );

        setOrder(payload);
        setOrderTable(dataTable);

        setLoading(false);
      })
      .catch(() => {
        router.push("/404");
      });
  };

  useEffect(() => {
    if (orderId) {
      getData(orderId as string);
    }
  }, [orderId]);

  return (
    <section className="px-5 pt-5">
      <div className="flex items-center justify-between gap-10">
        <h1 className="md:text-xl text-lg dark:text-darkText font-medium">
          {t("detailTitle")}{" "}
          <strong className="text-primary">#{orderId}</strong>
        </h1>

        <Button
          onClick={() => onShow(showPrint, setShowPrint)}
          icon={<AiOutlinePrinter />}
          size="large"
          type="primary"
          className="flex items-center text-base text-white bg-[#0E9F6E] hover:!bg-[#0E9F6E] px-5 py-2 rounded-md gap-2">
          Print Invoice
        </Button>
      </div>

      <div className="flex items-start lg:flex-row flex-col justify-between my-10 gap-10">
        <div className="lg:w-8/12 w-full flex flex-col gap-5">
          {/* Infomation */}
          {order && <MainInfoOrder data={order} />}

          {/* Table */}
          <div className="bg-[#f9fafb] border rounded-lg overflow-hidden">
            <OrderDetailTable data={orderTable} />

            {order && (
              <div className="flex items-start justify-end p-5">
                <div className="w-1/4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="md:text-base text-sm">
                      {t("detailTable.subtotal")}
                    </h3>
                    <p className="md:text-base text-sm">
                      {formatBigNumber(
                        currency.calc(order.sub_total),
                        currency.locale,
                        { style: "currency", currency: currency.symbol },
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="md:text-base text-sm">
                      {t("detailTable.ship")}
                    </h3>
                    <p className="md:text-base text-sm">
                      {formatBigNumber(
                        currency.calc(order.shipping.shipping_fee),
                        currency.locale,
                        { style: "currency", currency: currency.symbol },
                      )}
                    </p>
                  </div>
                  {order.discount && (
                    <div className="flex items-center justify-between">
                      <h3 className="md:text-base text-sm">
                        {t("detailTable.discount")}
                      </h3>
                      <p className="md:text-base text-sm">
                        {" "}
                        -{" "}
                        {formatBigNumber(
                          currency.calc(order.discount.discount_value),
                          currency.locale,
                          { style: "currency", currency: currency.symbol },
                        )}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black">
                    <h3 className="md:text-lg text-base font-medium">
                      {t("detailTable.total")}
                    </h3>
                    <p className="md:text-lg text-base font-medium text-primary">
                      {formatBigNumber(
                        currency.calc(order.total),
                        currency.locale,
                        { style: "currency", currency: currency.symbol },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="scroll lg:w-4/12 w-full bg-[#f9fafb] max-h-[500px] p-5 border rounded-lg overflow-auto">
          {order && <OrderProcess data={order.processing_info} />}
        </div>
      </div>

      {/* {data && (
        <ul className="py-5">
          <h2 className="md:text-lg text-base dark:text-darkText text-primary font-medium">
            Information
          </h2>
          <li className="flex items-center justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize dark:text-darkText">
              Order ID:
            </h3>
            <p className="text-[#707275] dark:text-darkText">{data.order_id}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize dark:text-darkText">Name:</h3>
            <p className="text-[#707275] dark:text-darkText">
              {data.user_infor.name}
            </p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize dark:text-darkText">
              Email:
            </h3>
            <p className="text-[#707275] dark:text-darkText">
              {data.user_infor.email}
            </p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize dark:text-darkText">
              Address:
            </h3>
            <p className="text-[#707275] dark:text-darkText">
              {data.user_infor.address}
            </p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize dark:text-darkText">Date:</h3>
            <p className="text-[#707275] dark:text-darkText">
              {getDateTime(data.createdAt)}
            </p>
          </li>
          <li className="flex items-start justify-start text-base mt-2 gap-1">
            <h3 className="font-medium capitalize dark:text-darkText">
              Status:
            </h3>
            <p
              className={`w-fit font-medium text-white text-xs ${
                BG_STATUS[data.status]
              } capitalize px-5 py-2 rounded-md`}>
              {data.status}
            </p>
          </li>

          {data.payment_status === PaymentStatus.success && (
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
          )}

          {data.payment_status !== PaymentStatus.success && (
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
          )}
        </ul>
      )} */}

      <FormFooter onCancel={() => router.push("/orders")} okElement={null} />

      {/* print pdf */}
      {showPrint && order && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999]">
          <div className="absolute w-full h-full bg-[#ffffffbf] backdrop-blur z-10"></div>
          <div
            onClick={() => onShow(showPrint, setShowPrint)}
            className="absolute w-full h-full bg-black opacity-60 z-20"></div>
          <div className="absolute w-10/12 h-screen top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-30">
            <PDFDocument data={order} />
          </div>
        </div>
      )}

      {loading && <Loading />}
    </section>
  );
};
export default OrderDetail;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

OrderDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

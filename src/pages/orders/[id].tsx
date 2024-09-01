import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import {
  useState,
  Fragment,
  useRef,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  ReactElement,
} from "react";
import { AiOutlinePrinter } from "react-icons/ai";

import {
  IItemOrder,
  IOrder,
  IOrderDetailTable,
  statusOrder,
} from "~/interface/order";

import Loading from "~/components/Loading";
import { getOrder, updateOrder, updatePaymentStatusOrder } from "~/api-client";
import { getValueCoupon } from "~/helper/number/coupon";
import { NextPageWithLayout } from "~/interface/page";
import { PrivateLayout } from "~/layouts";
import { IResponse } from "~/interface";
import { MainInfoOrder, OrderDetailTable } from "~/components/OrderPage";
import { formatBigNumber } from "~/helper/format/number";
import { useTranslations } from "next-intl";

// const PDFDocument = dynamic(() => import("~/components/PDFDocument/index"), {
//   loading: () => <Loading />,
//   ssr: false,
// });

const Layout = PrivateLayout;

const OrderDetail: NextPageWithLayout = () => {
  const t = useTranslations("OrderPage");

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
    <section className="p-5">
      <h1 className="lg:text-2xl md:text-xl text-lg dark:text-darkText font-medium">
        {t("detailTitle")}
      </h1>

      {order && <MainInfoOrder data={order} />}

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

      {/* Table */}
      <div className="py-10">
        <OrderDetailTable data={orderTable} />
      </div>

      {order && (
        <div className="flex md:flex-row flex-col md:items-start items-start justify-between bg-[#f9fafb] dark:bg-gray-800 p-5 border rounded-md gap-5">
          <div>
            <h3 className="lg:text-lg  md:text-base dark:text-darkText text-sm font-medium uppercase">
              Payment method
            </h3>
            <p className="md:text-base dark:text-darkText text-sm font-medium mt-2">
              Card
            </p>
          </div>
          <div>
            <h3 className="lg:text-lg  md:text-base dark:text-darkText text-sm font-medium uppercase">
              Shipping cost
            </h3>
            <p className="md:text-base dark:text-darkText text-sm font-medium mt-2">
              {formatBigNumber(order.shipping.shipping_fee)} VND
            </p>
          </div>
          {order.discount && (
            <div>
              <h3 className="lg:text-lg  md:text-base dark:text-darkText text-sm font-medium uppercase">
                Discount
              </h3>
              <ul>
                <li className="flex items-center justify-between gap-2">
                  <p className="md:text-base dark:text-darkText text-sm font-medium text-[#707275] mt-2">
                    Name:
                  </p>
                  <p className="md:text-base dark:text-darkText text-sm font-medium mt-2">
                    {order.discount.discount_code}
                  </p>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <p className="md:text-base dark:text-darkText text-sm font-medium text-[#707275] mt-2">
                    Value:
                  </p>
                  <p className="md:text-base dark:text-darkText text-sm font-medium mt-2">
                    -
                    {formatBigNumber(
                      getValueCoupon(
                        order.sub_total,
                        order.discount.discount_value as number,
                        order.discount.discount_type as string,
                      ),
                    )}{" "}
                    VND
                  </p>
                </li>
              </ul>
            </div>
          )}
          <div>
            <h3 className="lg:text-lg dark:text-darkText md:text-base text-sm font-medium uppercase">
              Total
            </h3>
            <p className="md:text-base text-sm text-[#0E9F6E] font-medium mt-2">
              {formatBigNumber(order.total)} VND
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => router.push("/orders")}
          className="min-w-[100px] text-base text-white bg-[#111926] px-5 py-2 opacity-90 hover:opacity-100 border-2 rounded-md">
          Back
        </button>

        <button
          onClick={() => onShow(showPrint, setShowPrint)}
          className="flex items-center text-base text-white bg-[#0E9F6E] px-5 py-2 rounded-md gap-2">
          Print Invoice
          <AiOutlinePrinter />
        </button>

        {/* print pdf */}
        {/* {showPrint && order && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999]">
            <div className="absolute w-full h-full bg-[#ffffffbf] backdrop-blur z-10"></div>
            <div
              onClick={() => onShow(showPrint, setShowPrint)}
              className="absolute w-full h-full bg-black opacity-60 z-20"></div>
            <div className="absolute w-10/12 h-screen top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-30">
              <PDFDocument data={order} />
            </div>
          </div>
        )} */}
      </div>

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

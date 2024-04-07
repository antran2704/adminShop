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
import { toast } from "react-toastify";
import { AiOutlinePrinter } from "react-icons/ai";

import { getDateTime } from "~/helper/datetime";
import { optionsCancle, optionsCancleByPayment } from "~/data/optionCancle";

import { IOptionCancle } from "~/interface";
import { IOrder, statusOrder, IItemOrder } from "~/interface/order";
import { PaymentStatus, typeCel } from "~/enums";

import { Table } from "~/components/Table";
import { CelTable } from "~/components/Table";

import { colHeaderOrderDetail as colHeadTable } from "~/components/Table/colHeadTable";
import Popup from "~/components/Popup";
import { ButtonClassic } from "~/components/Button";
import Loading from "~/components/Loading";
import { formatBigNumber } from "~/helper/number/fomatterCurrency";
import { getOrder, updateOrder, updatePaymentStatusOrder } from "~/api-client";
import { getValueCoupon } from "~/helper/number/coupon";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";

const PDFDocument = dynamic(() => import("~/components/PDFDocument/index"), {
  loading: () => <Loading />,
  ssr: false,
});

const BG_STATUS = {
  pending: "bg-warn",
  processing: "bg-primary",
  delivered: "bg-success",
  cancle: "bg-cancle",
};

const Layout = LayoutWithHeader;

const OrderDetail: NextPageWithLayout = () => {
  const router: NextRouter = useRouter();
  const orderId = router.query.id;
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const [data, setData] = useState<IOrder | null>(null);
  const [message] = useState<string | null>(null);
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
    setValue: Dispatch<SetStateAction<boolean>>
  ) => {
    setValue(!value);
  };

  const onChooseOption = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const value: string = e.target.value;
      setCancle(value);
      setDisableBtn(false);
    },
    [cancle, disableBtnCancle]
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

  const getDataOrder = async (id: string) => {
    setLoading(true);
    try {
      const response = await getOrder(id);
      if (response.status === 200) {
        setData(response.payload);
      }
    } catch (error) {
      router.push("/404");
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    if (orderId) {
      getDataOrder(orderId as string);
    }
  }, [orderId]);

  return (
    <section className="p-5">
      <h1 className="lg:text-2xl md:text-xl text-lg font-medium">
        Order detail
      </h1>
      {data && (
        <ul className="py-5">
          <h2 className="md:text-lg text-base text-primary font-medium">
            Information
          </h2>
          <li className="flex items-center justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Order ID:</h3>
            <p className="text-[#707275]">{data.order_id}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Name:</h3>
            <p className="text-[#707275]">{data.user_infor.name}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Email:</h3>
            <p className="text-[#707275]">{data.user_infor.email}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Address:</h3>
            <p className="text-[#707275]">{data.user_infor.address}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Date:</h3>
            <p className="text-[#707275]">{getDateTime(data.createdAt)}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-2 gap-1">
            <h3 className="font-medium capitalize">Status:</h3>
            <p
              className={`w-fit font-medium text-white text-xs ${
                BG_STATUS[data.status]
              } capitalize px-5 py-2 rounded-md`}
            >
              {data.status}
            </p>
          </li>

          {data.payment_status === PaymentStatus.success && (
            <div>
              {data.status === statusOrder.cancle && (
                <Fragment>
                  <li className="flex items-start justify-start text-base mt-1 gap-1">
                    <h3 className="font-medium capitalize">Why:</h3>
                    <p
                      className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}
                    >
                      {data.cancleContent || "updating"}
                    </p>
                  </li>
                  {data.note && (
                    <li className="flex items-start justify-start text-base mt-1 gap-1">
                      <h3 className="font-medium capitalize">Note:</h3>
                      <p
                        className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}
                      >
                        {data.note}
                      </p>
                    </li>
                  )}
                </Fragment>
              )}

              {data.status === statusOrder.pending && (
                <li className="flex items-center justify-start mt-5 text-base gap-1">
                  <h3 className="font-medium capitalize">Change Status:</h3>
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
                  <h3 className="font-medium capitalize">Change Status:</h3>
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
                    <h3 className="font-medium capitalize">Why:</h3>
                    <p
                      className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}
                    >
                      {data.cancleContent || "updating"}
                    </p>
                  </li>
                  {data.note && (
                    <li className="flex items-start justify-start text-base mt-1 gap-1">
                      <h3 className="font-medium capitalize">Note:</h3>
                      <p
                        className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}
                      >
                        {data.note}
                      </p>
                    </li>
                  )}
                </Fragment>
              )}

              {data.status === statusOrder.pending && (
                <li className="flex items-center justify-start mt-5 text-base gap-1">
                  <h3 className="font-medium capitalize">Confirm banking:</h3>
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
      )}
      {data && (
        <div className="my-5">
          <Table
            colHeadTabel={colHeadTable}
            message={message}
            loading={loading}
          >
            <Fragment>
              {data.items.map((item: IItemOrder, index: number) => (
                <tr key={item._id} className="hover:bg-slate-100">
                  <CelTable
                    center={true}
                    type={typeCel.TEXT}
                    value={(index + 1).toString()}
                  />
                  <CelTable
                    type={typeCel.THUMBNAIL}
                    value={item.product.thumbnail as string}
                    href={`/edit/product/${item.product._id}`}
                    className="w-20 h-20"
                  />
                  <CelTable
                    type={typeCel.LINK}
                    value={
                      item.variation ? item.variation.title : item.product.title
                    }
                    href={`/edit/product/${item.product._id}`}
                  />
                  <CelTable
                    center={true}
                    type={typeCel.TEXT}
                    value={
                      item.variation
                        ? item.variation.options?.join(" / ")
                        : "Default"
                    }
                  />
                  <CelTable
                    center={true}
                    type={typeCel.TEXT}
                    value={item.quantity.toString()}
                  />
                  <CelTable
                    center={true}
                    type={typeCel.TEXT}
                    value={formatBigNumber(item.price) + " VND"}
                  />
                  <CelTable
                    center={true}
                    type={typeCel.TEXT}
                    value={formatBigNumber(item.promotion_price) + " VND"}
                  />
                  <CelTable
                    center={true}
                    type={typeCel.TEXT}
                    value={
                      (item.promotion_price > 0
                        ? formatBigNumber(item.promotion_price * item.quantity)
                        : formatBigNumber(item.price * item.quantity)) + " VND"
                    }
                  />
                </tr>
              ))}
            </Fragment>
          </Table>
        </div>
      )}
      {data && (
        <div className="flex md:flex-row flex-col md:items-start items-start justify-between bg-[#f9fafb] p-5 border rounded-md gap-5">
          <div>
            <h3 className="lg:text-lg  md:text-base text-sm font-medium uppercase">
              Payment method
            </h3>
            <p className="md:text-base text-sm font-medium mt-2">Card</p>
          </div>
          <div>
            <h3 className="lg:text-lg  md:text-base text-sm font-medium uppercase">
              Shipping cost
            </h3>
            <p className="md:text-base text-sm font-medium mt-2">
              {formatBigNumber(data.shipping_cost)} VND
            </p>
          </div>
          {data.discount && (
            <div>
              <h3 className="lg:text-lg  md:text-base text-sm font-medium uppercase">
                Discount
              </h3>
              <ul>
                <li className="flex items-center justify-between gap-2">
                  <p className="md:text-base text-sm font-medium text-[#707275] mt-2">
                    Name:
                  </p>
                  <p className="md:text-base text-sm font-medium mt-2">
                    {data.discount.discount_code}
                  </p>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <p className="md:text-base text-sm font-medium text-[#707275] mt-2">
                    Value:
                  </p>
                  <p className="md:text-base text-sm font-medium mt-2">
                    -
                    {formatBigNumber(
                      getValueCoupon(
                        data.sub_total,
                        data.discount.discount_value as number,
                        data.discount.discount_type as string
                      )
                    )}{" "}
                    VND
                  </p>
                </li>
              </ul>
            </div>
          )}
          <div>
            <h3 className="lg:text-lg  md:text-base text-sm font-medium uppercase">
              Total
            </h3>
            <p className="md:text-base text-sm text-[#0E9F6E] font-medium mt-2">
              {formatBigNumber(data.total)} VND
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => router.push("/orders")}
          className="min-w-[100px] text-base text-white bg-[#111926] px-5 py-2 opacity-90 hover:opacity-100 border-2 rounded-md"
        >
          Back
        </button>

        <button
          onClick={() => onShow(showPrint, setShowPrint)}
          className="flex items-center text-base text-white bg-[#0E9F6E] px-5 py-2 rounded-md gap-2"
        >
          Print Invoice
          <AiOutlinePrinter />
        </button>

        {showPrint && data && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999]">
            <div className="absolute w-full h-full bg-[#ffffffbf] backdrop-blur z-10"></div>
            <div
              onClick={() => onShow(showPrint, setShowPrint)}
              className="absolute w-full h-full bg-black opacity-60 z-20"
            ></div>
            <div className="absolute w-10/12 h-screen top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-30">
              <PDFDocument data={data} />
            </div>
          </div>
        )}
      </div>
      {showConfirmBanking && (
        <Popup
          show={showConfirmBanking}
          title="Xác nhận đã chuyển khoản"
          onClose={onShowConfirmBanking}
        >
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
      )}

      {showCancle && data?.payment_status === PaymentStatus.success && (
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
                    className="text-sm font-medium text-gray-900 ml-2 block"
                  >
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
                placeholder="Enter note..."
              ></textarea>
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
      )}

      {showCancle && data?.payment_status !== PaymentStatus.success && (
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
                    className="text-sm font-medium text-gray-900 ml-2 block"
                  >
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
                placeholder="Enter note..."
              ></textarea>
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
                className={`${disableBtnCancle ? 'bg-[#d1d6e2]' : 'bg-success'}`}
              />
            </div>
          </div>
        </Popup>
      )}
      {showDelivered && (
        <Popup
          title="Bạn có muốn hoàn thành đơn hàng này"
          show={showDelivered}
          onClose={onShowDelivered}
        >
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
      )}
      {showProcessing && (
        <Popup
          title="Đang chuẩn bị đơn hàng"
          show={showProcessing}
          onClose={onShowProcessing}
        >
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
      )}
      {loading && <Loading />}
    </section>
  );
};
export default OrderDetail;

OrderDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
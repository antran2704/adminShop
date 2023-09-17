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
} from "react";
import { toast } from "react-toastify";
import { AiOutlinePrinter } from "react-icons/ai";

import { axiosGet, axiosPatch } from "~/ultils/configAxios";

import { getDateTime } from "~/helper/datetimeFormat";
import { currencyFormat } from "../../helper/currencyFormat";
import options from "./optionCancle";

import { IOrder, statusOrder, IItemOrder } from "~/interface/order";
import { typeCel, typeButton } from "~/enums";

import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";

import { colHeaderOrderDetail } from "~/components/Table/colHeadTable";
import Button from "~/components/Button";
import Popup from "~/components/Popup";

const PDFDocument = dynamic(() => import("~/components/PDFDocument/index"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const OrderDetail = () => {
  const router: NextRouter = useRouter();
  const orderId = router.query.id;

  const noteRef = useRef<HTMLTextAreaElement>(null);

  const [data, setData] = useState<IOrder | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [cancle, setCancle] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPrint, setShowPrint] = useState<boolean>(false);
  const [showCancle, setShowCancle] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [disableBtnCancle, setDisableBtn] = useState<boolean>(true);

  const onShowCancle = useCallback(() => {
    setShowCancle(!showCancle);
  }, [showCancle]);

  const onShowSuccess = useCallback(() => {
    setShowSuccess(!showSuccess);
  }, [showSuccess]);

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

  const hanldeChangeStatus = async (status: statusOrder) => {
    try {
      let payload;
      if (status === statusOrder.success) {
        payload = await axiosPatch(`order/status/${orderId}`, {
          status: statusOrder.success,
        });

        onShowSuccess();
      }

      if (status === statusOrder.cancle) {
        payload = await axiosPatch(`order/status/${orderId}`, {
          status: statusOrder.cancle,
          note: noteRef.current ? noteRef.current.value : null,
          cancleContent: cancle,
        });

        onShowCancle();
      }

      if (payload.status === 200) {
        toast.success("Success change status order", {
          position: toast.POSITION.TOP_RIGHT,
        });

        getDataOrder(orderId as string);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error change status order", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const getDataOrder = async (id: string) => {
    try {
      const response = await axiosGet(`/order/${id}`);

      if (response.status === 200) {
        setData(response.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (orderId) {
      getDataOrder(orderId as string);
    }
  }, [orderId]);

  return (
    <section className="lg:py-5 px-5 py-24">
      <h1 className="lg:text-2xl md:text-xl text-lg font-medium">
        Order detail
      </h1>

      {data && (
        <ul className="py-5">
          <h2 className="md:text-lg text-base text-primary font-medium">
            Information
          </h2>
          <li className="flex items-center justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Invoice ID:</h3>
            <p className="text-[#707275]">{data._id}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Name:</h3>
            <p className="text-[#707275]">{data.name}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Email:</h3>
            <p className="text-[#707275]">{data.email}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Address:</h3>
            <p className="text-[#707275]">{data.address}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Date:</h3>
            <p className="text-[#707275]">{getDateTime(data.createdAt)}</p>
          </li>
          <li className="flex items-start justify-start text-base mt-1 gap-1">
            <h3 className="font-medium capitalize">Status:</h3>
            <p
              className={`w-fit font-medium text-white text-xs bg-${data.status} capitalize px-5 py-2 rounded-md`}
            >
              {data.status}
            </p>
          </li>
          {data.status === statusOrder.cancle && (
            <li className="flex items-start justify-start text-base mt-1 gap-1">
              <h3 className="font-medium capitalize">Why:</h3>
              <p
                className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}
              >
                {data.cancleContent || "updating"}
              </p>
            </li>
          )}

          {/* {data.status === statusOrder.pending && ( */}
          <li className="flex items-start justify-start mt-5 text-base gap-1">
            <h3 className="font-medium capitalize">Change Status:</h3>
            <div className="flex items-center gap-3">
              <Button
                title="Success"
                type={typeButton.MEDIUM}
                onClick={onShowSuccess}
                className="text-white bg-success opacity-80 hover:opacity-100"
              />
              <Button
                title="Cancle"
                type={typeButton.MEDIUM}
                onClick={onShowCancle}
                className="text-white bg-cancle opacity-80 hover:opacity-100"
              />
            </div>
          </li>
          {/* )} */}
        </ul>
      )}

      {data && (
        <div className="my-5">
          <Table
            colHeadTabel={colHeaderOrderDetail}
            message={message}
            loading={loading}
          >
            <Fragment>
              {data.items.map((item: IItemOrder, index: number) => (
                <tr key={item.productId} className="hover:bg-slate-100">
                  <CelTable type={typeCel.TEXT} value={index.toString()} />
                  <CelTable
                    type={typeCel.LINK}
                    value={"Premium T-Shirtasdasdasdasd"}
                    href="/category"
                  />
                  <CelTable type={typeCel.TEXT} value={"1"} />
                  <CelTable
                    type={typeCel.TEXT}
                    value={currencyFormat(120000) + " VND"}
                  />
                  <CelTable
                    type={typeCel.TEXT}
                    value={currencyFormat(120000) + " VND"}
                  />
                </tr>
              ))}
            </Fragment>
          </Table>
        </div>
      )}

      {data && (
        <div className="flex md:flex-row flex-col md:items-center items-start justify-between bg-[#f9fafb] p-5 border rounded-md gap-5">
          <div>
            <h3 className="lg:text-lg  md:text-base text-sm font-medium uppercase">
              Payment method
            </h3>
            <p className="md:text-base text-sm font-medium text-[#707275] mt-2">
              Card
            </p>
          </div>
          <div>
            <h3 className="lg:text-lg  md:text-base text-sm font-medium uppercase">
              Shipping cost
            </h3>
            <p className="md:text-base text-sm font-medium text-[#707275] mt-2">
              {currencyFormat(30000)} VND
            </p>
          </div>
          <div>
            <h3 className="lg:text-lg  md:text-base text-sm font-medium uppercase">
              Total
            </h3>
            <p className="md:text-base text-sm font-medium text-primary mt-2">
              {currencyFormat(data.total)} VND
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end mt-5">
        <button
          onClick={() => onShow(showPrint, setShowPrint)}
          className="flex items-center text-base text-white bg-[#0E9F6E] px-5 py-2 rounded-md gap-2"
        >
          Print Invoice
          <AiOutlinePrinter />
        </button>

        {showPrint && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999]">
            <div
              onClick={() => onShow(showPrint, setShowPrint)}
              className="absolute w-full h-full bg-black opacity-60 z-10"
            ></div>
            <div className="absolute w-10/12 h-screen top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-20">
              <PDFDocument />
            </div>
          </div>
        )}
      </div>

      {showCancle && (
        <Popup show={showCancle} title="Lý do hủy đơn" onClose={onShowCancle}>
          <div className="mx-auto">
            <fieldset>
              <legend className="sr-only">Countries</legend>

              {options.map((option) => (
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
                className="w-full px-5 py-2 rounded-md border-2"
                name="note_option"
                id="note_option"
                cols={30}
                rows={4}
                placeholder="Enter note..."
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              <Button
                title="Cancle"
                type={typeButton.MEDIUM}
                onClick={onShowCancle}
                className="bg-[#e6e6e6] text-black opacity-80 hover:opacity-100"
              />

              <Button
                title="Accept"
                disable={disableBtnCancle}
                type={typeButton.MEDIUM}
                onClick={() => hanldeChangeStatus(statusOrder.cancle)}
                className="bg-success text-white"
              />
            </div>
          </div>
        </Popup>
      )}

      {showSuccess && (
        <Popup
          title="Bạn có muốn hoàn thành đơn hàng này"
          show={showSuccess}
          onClose={onShowSuccess}
        >
          <div className="flex items-center justify-between">
            <Button
              title="Cancle"
              type={typeButton.MEDIUM}
              onClick={onShowSuccess}
              className="bg-[#e6e6e6] text-black opacity-80 hover:opacity-100"
            />

            <Button
              title="Accept"
              type={typeButton.MEDIUM}
              onClick={() => hanldeChangeStatus(statusOrder.success)}
              className="bg-success text-white opacity-80 hover:opacity-100"
            />
          </div>
        </Popup>
      )}
    </section>
  );
};
export default OrderDetail;

import dynamic from "next/dynamic";
import { useState, Fragment, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { AiOutlinePrinter } from "react-icons/ai";

import { currencyFormat } from "../../../helper/currencyFormat";

import { typeCel, typeButton } from "~/enums";
import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";

import { colHeaderOrderDetail } from "~/components/Table/colHeadTable";
import Button from "~/components/Button";
import Popup from "~/components/Popup";
import axios from "axios";

const MyDocument = dynamic(() => import("~/components/MyDocument/"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const OrderDetail = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPrint, setShowPrint] = useState<boolean>(false);
  const [showCancle, setShowCancle] = useState<boolean>(false);

  const onShow = (
    value: boolean,
    setValue: Dispatch<SetStateAction<boolean>>
  ) => {
    setValue(!value);
  };

  const hanldeChangeStatus: () => void = async () => {
    try {
      const payload = await axios
        .patch(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/order/123`, {
          status: "success",
        })
        .then((res) => res.data);

      if (payload.status === 200) {
        toast.success("Success change status order", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error change status order", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <section className="lg:py-5 px-5 py-24">
      <h1 className="lg:text-2xl md:text-xl text-lg font-medium">
        Order detail
      </h1>

      <ul className="py-5">
        <h2 className="md:text-lg text-base text-primary font-medium">
          Information
        </h2>
        <li className="flex items-center justify-start text-base mt-1 gap-1">
          <h3 className="font-medium capitalize">Invoice ID:</h3>
          <p className="text-[#707275]">123</p>
        </li>
        <li className="flex items-start justify-start text-base mt-1 gap-1">
          <h3 className="font-medium capitalize">Name:</h3>
          <p className="text-[#707275]">test</p>
        </li>
        <li className="flex items-start justify-start text-base mt-1 gap-1">
          <h3 className="font-medium capitalize">Email:</h3>
          <p className="text-[#707275]">phamtrangiaan27@gmail.com</p>
        </li>
        <li className="flex items-start justify-start text-base mt-1 gap-1">
          <h3 className="font-medium capitalize">Address:</h3>
          <p className="text-[#707275]">55 Nguyen Kiem, P3, HCM</p>
        </li>
        <li className="flex items-start justify-start text-base mt-1 gap-1">
          <h3 className="font-medium capitalize">Date:</h3>
          <p className="text-[#707275]">29/06/2023, 21:50:24</p>
        </li>
        <li className="flex items-start justify-start text-base mt-1 gap-1">
          <h3 className="font-medium capitalize">Status:</h3>
          <p
            className={`w-fit font-medium text-white text-xs bg-pending capitalize px-5 py-2 rounded-md`}
          >
            pending
          </p>
        </li>
        <li className="flex items-start justify-start text-base mt-1 gap-1">
          <h3 className="font-medium capitalize">Why:</h3>
          <p
            className={`w-fit text-white bg-cancle text-base capitalize px-4 py-1 rounded-md`}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
            perspiciatis blanditiis amet quae laboriosam? Aliquid, sit vitae?
            Distinctio mollitia fugit delectus nobis blanditiis dolor aut minus?
            Suscipit nisi qui nam!
          </p>
        </li>
        <li className="flex items-start justify-start mt-5 text-base gap-1">
          <h3 className="font-medium capitalize">Change Status:</h3>
          <div className="flex items-center gap-3">
            <Button
              title="Success"
              type={typeButton.MEDIUM}
              onClick={() => onShow(showCancle, setShowCancle)}
              className="text-white bg-success opacity-80 hover:opacity-100"
            />
            <Button
              title="Cancle"
              type={typeButton.MEDIUM}
              className="text-white bg-cancle opacity-80 hover:opacity-100"
            />
          </div>
        </li>
      </ul>

      <div className="my-5">
        <Table
          colHeadTabel={colHeaderOrderDetail}
          message={message}
          loading={loading}
        >
          <Fragment>
            <tr className="hover:bg-slate-100">
              <CelTable type={typeCel.TEXT} value={"#112314234"} />
              <CelTable
                type={typeCel.LINK}
                value={"Premium T-Shirt"}
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
            <tr className="hover:bg-slate-100">
              <CelTable type={typeCel.TEXT} value={"1"} />
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
          </Fragment>
        </Table>
      </div>

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
            {currencyFormat(3000000)} VND
          </p>
        </div>
      </div>

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
              <MyDocument />
            </div>
          </div>
        )}
      </div>

      <Popup
        show={showCancle}
        onClose={() => onShow(showCancle, setShowCancle)}
      >
        <div className="flex items-center justify-between">
          <Button
            title="Cancle"
            type={typeButton.MEDIUM}
            onClick={() => onShow(showCancle, setShowCancle)}
            className="bg-[#e6e6e6] text-black opacity-80 hover:opacity-100"
          />

          <Button
            title="Accept"
            type={typeButton.MEDIUM}
            onClick={hanldeChangeStatus}
            className="bg-success text-white opacity-80 hover:opacity-100"
          />
        </div>
      </Popup>
    </section>
  );
};
export default OrderDetail;

import dynamic from "next/dynamic";
import { useState, Fragment } from "react";
import { AiOutlinePrinter } from "react-icons/ai";

import { typeCel } from "~/enums";
import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";

import { colHeaderOrderDetail } from "~/components/Table/colHeadTable";

const MyDocument = dynamic(() => import("~/components/MyDocument/"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const OrderDetail = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPrint, setShowPrint] = useState<boolean>(false);

  const onShowPrint = () => {
    setShowPrint(!showPrint);
  }

  return (
    <section className="lg:py-5 px-5 py-24">
      <h1 className="lg:text-2xl md:text-xl text-lg font-medium">
        Order detail
      </h1>

      <ul className="py-5">
        <h2 className="md:text-lg text-base text-primary font-medium">
          Information
        </h2>
        <li className="flex items-center justify-start text-base gap-1">
          <h3 className="font-medium capitalize">Invoice ID:</h3>
          <p className="text-[#707275]">123</p>
        </li>
        <li className="flex items-center justify-start text-base gap-1">
          <h3 className="font-medium capitalize">Name:</h3>
          <p className="text-[#707275]">test</p>
        </li>
        <li className="flex items-center justify-start text-base gap-1">
          <h3 className="font-medium capitalize">Email:</h3>
          <p className="text-[#707275]">phamtrangiaan27@gmail.com</p>
        </li>
        <li className="flex items-center justify-start text-base gap-1">
          <h3 className="font-medium capitalize">Address:</h3>
          <p className="text-[#707275]">55 Nguyen Kiem, P3, HCM</p>
        </li>
        <li className="flex items-center justify-start text-base gap-1">
          <h3 className="font-medium capitalize">Date:</h3>
          <p className="text-[#707275]">29/06/2023, 21:50:24</p>
        </li>
        <li className="flex items-center justify-start text-base gap-1">
          <h3 className="font-medium capitalize">Status:</h3>
          <p
            className={`w-fit font-medium text-white text-xs bg-success capitalize px-5 py-2 rounded-xl`}
          >
            success
          </p>
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
              <CelTable type={typeCel.TEXT} value={"120.000 VND"} />
              <CelTable type={typeCel.TEXT} value={"120.000 VND"} />
            </tr>
            <tr className="hover:bg-slate-100">
              <CelTable type={typeCel.TEXT} value={"1"} />
              <CelTable
                type={typeCel.LINK}
                value={"Premium T-Shirtasdasdasdasd"}
                href="/category"
              />
              <CelTable type={typeCel.TEXT} value={"1"} />
              <CelTable type={typeCel.TEXT} value={"120.000 VND"} />
              <CelTable type={typeCel.TEXT} value={"120.000 VND"} />
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
            30.000 VND
          </p>
        </div>
        <div>
          <h3 className="lg:text-lg  md:text-base text-sm font-medium uppercase">
            Total
          </h3>
          <p className="md:text-base text-sm font-medium text-primary mt-2">
            300.000 VND
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end mt-5">
        <button onClick={onShowPrint} className="flex items-center text-base text-white bg-[#0E9F6E] px-5 py-2 rounded-md gap-2">
          Print Invoice
          <AiOutlinePrinter />
        </button>

        {showPrint && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999]">
            <div onClick={onShowPrint} className="absolute w-full h-full bg-black opacity-60 z-10"></div>
            <div className="absolute w-10/12 h-screen top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-20">
              <MyDocument />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default OrderDetail;

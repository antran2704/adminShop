import { useState, useEffect, ReactElement } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiDollarCircle, BiPackage, BiMinusCircle } from "react-icons/bi";

import { SelectDate } from "~/components/Select";
import Statistic from "~/components/Statistic";
import { axiosGet } from "~/ultils/configAxios";
import { IGrowDate } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";

const initOverviewDate: IGrowDate = {
  gross: 0,
  sub_gross: 0,
  orders: 0,
  cancle_orders: 0,
  delivered_orders: 0,
  updatedAt: null,
  date: new Date().toLocaleDateString(),
};

const Layout = LayoutWithHeader;

const IncomeDatePage: NextPageWithLayout = () => {
  const [growDate, setGrowDate] = useState<IGrowDate>(initOverviewDate);
  const [selectDate, setSelectDate] = useState<string>(
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`
  );

  const onSelectDate = (value: string) => {
    if (!value) return;

    handleGetGrossDate(value);
    setSelectDate(value);
  };

  const handleGetGrossDate = async (date: string) => {
    const convertDate = new Date(date).toLocaleDateString("en-GB");

    try {
      const { status, payload } = await axiosGet(
        `/gross-date?gross_date=${convertDate}`
      );

      if (status === 200) {
        setGrowDate({
          date: convertDate,
          gross: payload.gross,
          orders: payload.orders.length,
          sub_gross: payload.sub_gross || 0,
          cancle_orders: payload.cancle_orders || 0,
          delivered_orders: payload.delivered_orders || 0,
          updatedAt: payload.updatedAt,
        });
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setGrowDate({
          ...initOverviewDate,
          date: convertDate,
          updatedAt: null,
        });
      }
    }
  };

  useEffect(() => {
    handleGetGrossDate(new Date().toString());
  }, []);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full">
        <h1 className="md:text-3xl text-2xl dark:text-darkText font-bold">
          {" "}
          Dashboard Overview Income Date
        </h1>
      </div>

      <div className="w-full gap-10">
        <div className="w-full rounded-xl py-5">
          <SelectDate
            type="date"
            title="Select Date"
            name="date"
            className="lg:w-2/12 md:w-3/12 w-5/12 mb-5"
            value={selectDate || ""}
            onSelect={onSelectDate}
          />

          <div>
            <h3 className="text-lg font-medium text-center dark:text-darkText">
              Thu nhập ngày: {growDate.date}
            </h3>
            {growDate.updatedAt && (
              <p className="text-lg font-medium text-center dark:text-darkText">
                (Dữ liệu cập nhật lúc{" "}
                {new Date(growDate.updatedAt).toLocaleTimeString()} ngày{" "}
                {new Date(growDate.updatedAt).toLocaleDateString("en-GB")})
              </p>
            )}
            {!growDate.updatedAt && (
              <p className="text-lg font-medium text-center dark:text-darkText">Chưa có dữ liệu</p>
            )}
          </div>
          <div
            className={`grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300 mt-5`}
          >
            <Statistic
              title="Thu nhập tạm tính"
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={growDate.sub_gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />
            <Statistic
              title="Tổng thu nhập"
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={growDate.gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />

            <Statistic
              title="Tổng đơn hàng"
              IconElement={<AiOutlineShoppingCart className="text-4xl" />}
              to={growDate.orders}
              backgroundColor="bg-[#0891b2]"
              duration={0}
            />

            <Statistic
              title="Đơn hàng thành công"
              IconElement={<BiPackage className="text-4xl" />}
              to={growDate.delivered_orders}
              backgroundColor="bg-success"
              duration={0}
            />

            <Statistic
              title="Đơn hàng thành công"
              IconElement={<BiMinusCircle className="text-4xl" />}
              to={growDate.cancle_orders}
              backgroundColor="bg-cancle"
              duration={0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncomeDatePage;

IncomeDatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
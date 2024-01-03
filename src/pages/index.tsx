import { useState, useEffect, useRef } from "react";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  BiCircleThreeQuarter,
  BiDollarCircle,
  BiPackage,
  BiAlarm,
  BiMinusCircle,
} from "react-icons/bi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { Table, CelTable } from "~/components/Table";

import { typeCel } from "~/enums";
import Link from "next/link";
import SpringCount from "~/components/SpringCount";
import { axiosGet } from "~/ultils/configAxios";
import { getFirstDayInWeek } from "~/helper/datetime";
import { IGrowDate } from "~/interface";
import Statistic from "~/components/Statistic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Overview in week",
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const colHeadTable = ["Name", "Email", "Phone", "Status", "", ""];

interface IOverview {
  gross: number;
  total_orders: string[];
  pending_orders: number;
  processing_orders: number;
  delivered_orders: number;
  cancle_orders: number;
}

const initOveviews: IOverview = {
  gross: 0,
  total_orders: [],
  processing_orders: 0,
  cancle_orders: 0,
  delivered_orders: 0,
  pending_orders: 0,
};

export default function Home() {
  const data = {
    labels: [],
    datasets: [
      {
        label: "Sub Gross",
        data: [],
        backgroundColor: "rgb(255, 99, 132)",
        borderRadius: 10,
        borderWidth: 0,
      },
      {
        label: "Gross",
        data: [],
        backgroundColor: "rgb(75, 192, 192)",
        borderRadius: 10,
        borderWidth: 0,
      },
    ],
  };

  const chartWeekRef = useRef<any>();

  const [overviews, setOverviews] = useState<IOverview>(initOveviews);
  const [dataBarWeek, setDataBarWeek] = useState<any>(data);

  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingOverviews, setLoadingOvervies] = useState<boolean>(true);

  const handleGetOverviews = async () => {
    setLoadingOvervies(true);

    try {
      const date = new Date().toLocaleDateString("en-GB");
      const { status, payload } = await axiosGet(
        `/overviews/home?date=${date}`
      );

      if (status === 200) {
        setOverviews(payload);
      }
      setLoadingOvervies(false);
    } catch (error) {
      console.log(error);
      setLoadingOvervies(false);
    }
  };

  const handleGetGrossInWeek = async (startDate: Date) => {
    try {
      const { status, payload } = await axiosGet(
        `/gross-date/week?start_date=${startDate.toDateString()}`
      );

      const startDay = startDate.getDate();
      const newData: any = data;

      for (let i = 0; i <= 6; i++) {
        const nextDay = new Date();
        nextDay.setDate(startDay + i);
        newData.labels.push(nextDay.getDate());
        newData.datasets[0].data[i] = 0;
        newData.datasets[1].data[i] = 0;
      }

      if (payload.length === 0) {
        setDataBarWeek(newData);
        chartWeekRef.current.update();
      }

      if (status === 200 && payload.length > 0) {
        payload.map((item: IGrowDate) => {
          const day = Number(item.day);
          const index = newData.labels.findIndex(
            (label: number) => label === day
          );
          newData.datasets[0].data[index] = item.sub_gross;
          newData.datasets[1].data[index] = item.gross;
        });

        setDataBarWeek(newData);
        chartWeekRef.current.update();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    const firstDay = getFirstDayInWeek(new Date().toDateString());
    handleGetGrossInWeek(firstDay);
    handleGetOverviews();
  }, []);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full h-[10%] mb-5">
        <h1 className="md:text-3xl text-2xl font-bold mb-1">
          Welcome Admin Dashboard Antrandev
        </h1>
        <p className="text-lg font-medium">
          Manager your maketing's performence
        </p>
      </div>
      <div className="w-full lg:mb-10 mb-5">
        <h2 className="text-title mb-4">Dashboard Overview</h2>
        <div className="h-full gap-10">
          <div className="relative w-full mb-10">
            <div
              className={`grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full h-full md:max-h-max ${
                show ? "max-h-[2000px]" : "max-h-[600px]"
              } gap-2 overflow-hidden transition-all ease-in-out duration-300`}
            >
              <Statistic
                title="Thu nhập hôm nay"
                IconElement={<BiDollarCircle className="text-4xl" />}
                to={overviews.gross}
                backgroundColor="bg-[#5032fd]"
                duration={0.5}
                specialCharacter="VND"
              />

              <Statistic
                title="Đơn hàng hôm nay"
                IconElement={<AiOutlineShoppingCart className="text-4xl" />}
                to={overviews.total_orders.length}
                backgroundColor="bg-[#0891b2]"
                duration={0.5}
              />

              <Statistic
                title="Tổng đơn hàng thành công"
                IconElement={<BiPackage className="text-4xl" />}
                to={overviews.delivered_orders}
                backgroundColor="bg-[#0891b2]"
                duration={0.5}
              />

              <Statistic
                title="Chờ xác nhận"
                IconElement={<BiPackage className="text-4xl" />}
                to={overviews.pending_orders}
                backgroundColor="bg-warn"
                duration={0.5}
              />

              <Statistic
                title="Đang chuẩn bị hàng"
                IconElement={<BiCircleThreeQuarter className="text-4xl" />}
                to={overviews.processing_orders}
                backgroundColor="bg-primary"
                duration={0.5}
              />

              <Statistic
                title="Tổng đơn hủy"
                IconElement={<BiMinusCircle className="text-4xl" />}
                to={overviews.cancle_orders}
                backgroundColor="bg-cancle"
                duration={0.5}
              />
            </div>

            <button
              onClick={() => setShow(!show)}
              className="md:hidden block absolute -bottom-10 left-1/2 -translate-x-1/2 select-none"
            >
              {!show && (
                <MdOutlineKeyboardDoubleArrowDown className="text-3xl text-primary" />
              )}
              {show && (
                <MdOutlineKeyboardDoubleArrowUp className="text-3xl text-primary" />
              )}
            </button>
          </div>
          <div className="lg:w-3/4 w-full h-full bg-[#f4f7ff] rounded-xl p-5 mx-auto">
            <div>
              <SpringCount
                className="text-lg font-bold"
                from={0}
                to={4413954}
                specialCharacter="VND"
                duration={0.5}
              />
            </div>
            <Bar ref={chartWeekRef} options={options} data={dataBarWeek} />
          </div>
        </div>
      </div>
      <div className="w-full pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-title">Recent Order</h2>
          <Link
            href={"/orders"}
            className="text-base font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <div>
          <Table
            colHeadTabel={colHeadTable}
            message={message}
            loading={loading}
          >
            <tr className="hover:bg-slate-100">
              <CelTable type={typeCel.TEXT} value={"1"} />
              <CelTable type={typeCel.TEXT} value={"Antrandev"} />
              <CelTable
                type={typeCel.TEXT}
                value={"phamtrangiaan27@gmail.com"}
              />
              <CelTable
                type={typeCel.TEXT}
                value={"0946003423"}
                className="text-primary"
              />
              <CelTable type={typeCel.STATUS} value={"pending"} />
              <CelTable type={typeCel.GROUP}>
                <>
                  <Link
                    href={"/"}
                    className="block w-fit px-3 py-2 border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                  >
                    <AiOutlineEdit className="text-xl w-fit" />
                  </Link>
                </>
              </CelTable>
            </tr>
          </Table>
        </div>
      </div>
    </section>
  );
}

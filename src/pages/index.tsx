import { useState, useEffect } from "react";
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
      text: "Overview 5 days",
    },
  },
};

const colHeadTable = ["Name", "Email", "Phone", "Status", "", ""];

const getDate = (count: number = 0) => {
  const newDate = new Date();
  const date = newDate.getDate();

  newDate.setDate(date - count);
  return newDate.toLocaleDateString();
};

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
        label: "Gross",
        data: [],
        backgroundColor: "#418efd",
        borderRadius: 10,
        borderWidth: 0,
      },
    ],
  };

  const [overviews, setOverviews] = useState<IOverview>(initOveviews);

  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingOverviews, setLoadingOvervies] = useState<boolean>(true);
  const [dataBar, setDataBar] = useState<any>(data);
  const [inp, setInp] = useState("");

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

  const handleGetGross = async () => {
    try {
      const { status, payload } = await axiosGet(`/gross-date/home`);
      if (status === 200) {
        const newData = dataBar;

        payload.map((item: any) => {
          newData.labels.push(item.date);
          newData.datasets[0].data.push(item.gross);
        });

        setDataBar(newData);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetOverviews();
    handleGetGross();
  }, []);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <input
        type="week"
        onChange={(e) => {
          console.log(e.target.valueAsDate?.getDate());
          console.log([e.target]);
        }}
      />
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
        <div className="flex lg:flex-row flex-col-reverse items-start justify-between h-full gap-10">
          <div className="lg:w-7/12 w-full h-full bg-[#f4f7ff] rounded-xl p-5">
            <div>
              <SpringCount
                className="text-lg font-bold"
                from={0}
                to={4413954}
                specialCharacter="VND"
              />
            </div>
            {!loading && <Bar options={options} data={dataBar} />}
          </div>
          <div className="relative lg:w-5/12 w-full mb-10">
            <div
              className={`grid md:grid-cols-2 grid-cols-1 w-full h-full md:max-h-max ${
                show ? "max-h-[2000px]" : "max-h-[600px]"
              } gap-2 overflow-hidden transition-all ease-in-out duration-300`}
            >
              <div className="flex flex-col items-center w-full bg-[#5032fd] text-white px-5 py-10 rounded-xl gap-2">
                <BiDollarCircle className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Income today
                </p>
                {!loadingOverviews && (
                  <SpringCount
                    className="text-2xl font-bold"
                    from={0}
                    specialCharacter="VND"
                    to={overviews.gross}
                  />
                )}
              </div>
              <div className="flex flex-col items-center w-full bg-[#0891b2] text-white px-5 py-10 rounded-xl gap-2">
                <AiOutlineShoppingCart className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Orders today
                </p>
                {!loadingOverviews && (
                  <SpringCount
                    className="text-2xl font-bold"
                    from={0}
                    to={overviews.total_orders.length}
                  />
                )}
              </div>
              <div className="flex flex-col items-center w-full bg-success text-white px-5 py-10 rounded-xl gap-2">
                <BiPackage className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Orders Delivered
                </p>
                {!loadingOverviews && (
                  <SpringCount
                    className="text-2xl font-bold"
                    from={0}
                    to={overviews.delivered_orders}
                  />
                )}
              </div>
              <div className="flex flex-col items-center w-full bg-warn text-white px-5 py-10 rounded-xl gap-2">
                <BiAlarm className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Orders Pending
                </p>
                {!loadingOverviews && (
                  <SpringCount
                    className="text-2xl font-bold"
                    from={0}
                    to={overviews.pending_orders}
                  />
                )}
              </div>
              <div className="flex flex-col items-center w-full bg-primary text-white px-5 py-10 rounded-xl gap-2">
                <BiCircleThreeQuarter className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Orders Processing
                </p>
                {!loadingOverviews && (
                  <SpringCount
                    className="text-2xl font-bold"
                    from={0}
                    to={overviews.processing_orders}
                  />
                )}
              </div>
              <div className="flex flex-col items-center w-full bg-cancle text-white px-5 py-10 rounded-xl gap-2">
                <BiMinusCircle className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Orders Cancle
                </p>
                {!loadingOverviews && (
                  <SpringCount
                    className="text-2xl font-bold"
                    from={0}
                    to={overviews.cancle_orders}
                  />
                )}
              </div>
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

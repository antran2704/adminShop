import { useState, useRef } from "react";
import { animate, motion } from "framer-motion";
import { AiOutlineEdit, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCircleThreeQuarter } from "react-icons/bi";
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

import {Table, CelTable} from "~/components/Table";

import { typeCel } from "~/enums";
import Link from "next/link";
import SpringCount from "~/components/SpringCount";

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
      text: "Chart.js Bar Chart2",
    },
  },
};

const colHeadTable = ["Name", "Email", "Phone", "Status", "", ""];

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dataset 1",
        data: [1, 2, 30.2],
        backgroundColor: "#418efd",
        borderRadius: 10,
        borderWidth: 0,
      },
    ],
  };

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
        <div className="flex lg:flex-row flex-col items-start justify-between h-full gap-10">
          <div className="lg:w-7/12 w-full h-full bg-[#f4f7ff] rounded-xl p-5">
            <div>
              <SpringCount
                className="text-lg font-bold"
                from={0}
                to={4413954}
                specialCharacter="$"
              />
              <span className="text-base text-[#b0b0b0]">Increase</span>
            </div>
            <Bar options={options} data={data} />
          </div>
          <div className="flex flex-col lg:w-5/12 w-full h-full gap-2">
            <div className="w-full lg:h-[60%] bg-[#ecf3fe] px-5 py-10 rounded-xl">
              <div className="flex items-center mb-3 gap-2">
                <BiCircleThreeQuarter className="text-4xl text-[#74aef8]" />
                <SpringCount
                  className="text-3xl font-bold"
                  from={0}
                  to={5433}
                  specialCharacter="K"
                />
              </div>
              <p className="text-lg font-medium">Total today</p>
            </div>
            <div className="flex item-start justify-between w-full lg:h-[40%] bg-[#eef8f3] px-5 py-10 rounded-xl gap-10">
              <div>
                <h3 className="text-xl font-bold mb-3">
                  Orders today:
                  <SpringCount
                    from={0}
                    to={23}
                  />
                </h3>
                <Link
                  href={"/orders"}
                  className="w-fit font-medium text-white bg-[#71ce98] px-5 py-2 rounded-lg mx-auto"
                >
                  Detail
                </Link>
              </div>
              <AiOutlineShoppingCart className="text-3xl" />
            </div>
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

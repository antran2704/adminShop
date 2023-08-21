import { useState } from "react";
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

import Table from "~/components/Table";
import CelTable from "~/components/Table/CelTable";

import { typeCel } from "~/enums";
import Link from "next/link";

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

const colHeadTable = ["Name", "Email", "Phone", "Status", ""];

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
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 lg:pt-5 pt-24 overflow-auto gap-5">
      <div className="w-full h-[10%] lg:mb-10 mb-5">
        <h1 className="lg:text-3xl text-2xl font-bold mb-1">
          Welcome Back Antrandev
        </h1>
        <p className="text-lg"> Manager your maketing's performence</p>
      </div>
      <div className="w-full lg:mb-10 mb-5">
        <h2 className="text-xl font-medium mb-4">Performance</h2>
        <div className="flex lg:flex-row flex-col items-start justify-between h-full gap-10">
          <div className="lg:w-7/12 w-full h-full bg-[#f4f7ff] rounded-xl p-5">
            <div>
              <h3 className="text-lg font-bold">$4.4139,54</h3>
              <span className="text-base text-[#b0b0b0]">Increase</span>
            </div>
            <Bar options={options} data={data} />
          </div>
          <div className="flex flex-col lg:w-5/12 w-full h-full gap-2">
            <div className="w-full lg:h-[60%] bg-[#ecf3fe] px-5 py-10 rounded-xl">
              <div className="flex items-center mb-3 gap-2">
                <BiCircleThreeQuarter className="text-4xl text-[#74aef8]" />
                <p className="text-3xl font-bold">543.3K</p>
              </div>
              <p className="text-lg font-medium">Total today</p>
            </div>
            <div className="flex item-start justify-between w-full lg:h-[40%] bg-[#eef8f3] px-5 py-10 rounded-xl gap-10">
              <div>
                <h3 className="text-xl font-bold mb-3">Orders today: 23</h3>
                <Link href={"/orders"} className="w-fit font-medium text-white bg-[#71ce98] px-5 py-2 rounded-lg mx-auto">
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
          <h2 className="text-xl font-medium">Recent Order</h2>
          <Link
            href={"/orders"}
            className="text-base font-medium text-[#74aef8] hover:underline"
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
              <CelTable
                type={typeCel.BUTTON_LINK}
                href={`/`}
                value={""}
                icon={<AiOutlineEdit className="text-xl w-fit" />}
              />
            </tr>
          </Table>
        </div>
      </div>
    </section>
  );
}

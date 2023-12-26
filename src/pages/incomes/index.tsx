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
import { SelectDate, SelectItem, SelectTag } from "~/components/Select";
import { ISelectItem } from "~/interface";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

enum TYPE_TAG {
  DATE = "date",
  MONTH = "month",
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: true,
      //   text: "Overview 5 days",
    },
  },
};

interface IGrow {
  gross: number;
  sub_gross: number;
  orders: number;
  delivered_orders: number;
  cancle_orders: number;
}

interface IGrowDate extends IGrow {
  date: string;
}

interface ISelectGrowMonth {
  month: number;
  year: number;
}

const initOverviewDate: IGrowDate = {
  gross: 0,
  sub_gross: 0,
  orders: 0,
  cancle_orders: 0,
  delivered_orders: 0,
  date: new Date().toLocaleDateString(),
};

const initSelectGrowMonth: ISelectGrowMonth = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
};

const MONTH: ISelectItem[] = [
  {
    _id: "1",
    title: "1",
  },
  {
    _id: "2",
    title: "2",
  },
  {
    _id: "3",
    title: "3",
  },
  {
    _id: "4",
    title: "4",
  },
  {
    _id: "5",
    title: "5",
  },
  {
    _id: "6",
    title: "6",
  },
  {
    _id: "7",
    title: "7",
  },
  {
    _id: "8",
    title: "8",
  },
  {
    _id: "9",
    title: "9",
  },
  {
    _id: "10",
    title: "10",
  },
  {
    _id: "11",
    title: "11",
  },
  {
    _id: "12",
    title: "12",
  },
];

export default function IncomePage() {
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

  const chartMonthRef = useRef<any>();

  const [tag, setTag] = useState<TYPE_TAG>(TYPE_TAG.DATE);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingGrowDate, setLoadingGrowDate] = useState<boolean>(true);

  const [dataBar, setDataBar] = useState<any>(data);

  const [growDate, setGrowDate] = useState<IGrowDate>(initOverviewDate);

  const [selectDate, setSelectDate] = useState<string | null>(null);
  const [selectMonth, setSelectMonth] =
    useState<ISelectGrowMonth>(initSelectGrowMonth);

  const onSelecTag = (value: string) => {
    if (value === TYPE_TAG.MONTH) {
      handleGetGrossInMonth(selectMonth.month.toString());
    }

    setTag(value as TYPE_TAG);
  };

  const onSelectDate = (value: string) => {
    handleGetGrossDate(value);
    setSelectDate(value);
  };

  const onSelectMonth = (value: string, name: string) => {
    handleGetGrossInMonth(value);
    setSelectMonth({ ...selectMonth, [name]: Number(value) });
  };

  const handleGetGrossDate = async (date: string) => {
    setLoadingGrowDate(true);

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
        });
      }

      setLoadingGrowDate(false);
    } catch (error: any) {
      if (error.response.status === 404) {
        setGrowDate({ ...initOverviewDate, date: convertDate });
      }
      setLoadingGrowDate(false);
      console.log(error);
    }
  };

  const handleGetGrossInMonth = async (month: string) => {
    setLoading(true);

    try {
      const { status, payload } = await axiosGet(
        `/gross-date/month?gross_month=${month}&gross_year=${new Date().getFullYear()}`
      );
      if (status === 200) {
        const days = new Date(2023, Number(month), 0).getDate();
        const newData: any = data;
        for (let i = 1; i <= days; i++) {
          newData.labels.push(`${i}/${month}`);
          newData.datasets[0].data.push(0);
        }

        payload.map((item: any) => {
          const day = Number(item.day);
          newData.datasets[0].data[day] = item.gross;
        });
        chartMonthRef.current.update();
        setDataBar(newData);
      }
      setLoading(false);
    } catch (error: any) {
      if (error.response.status === 404) {
      }
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetGrossDate(new Date().toString());
  }, []);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full">
        <h1 className="md:text-3xl text-2xl font-bold">Income</h1>
      </div>
      <div className="w-full">
        <h2 className="text-title mb-4">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <SelectTag
            size="L"
            value={TYPE_TAG.DATE}
            title="Date"
            onSelect={onSelecTag}
            currentSelect={tag}
          />
          <SelectTag
            size="L"
            value={TYPE_TAG.MONTH}
            title="Month"
            onSelect={onSelecTag}
            currentSelect={tag}
          />
          {/* <SelectTag
            size="L"
            value="year"
            title="Year"
            onSelect={onSelecTag}
            currentSelect={tag}
          /> */}
        </div>
      </div>
      <div className="w-full gap-10">
        {/* {tag === TYPE_TAG.DATE && ( */}
        <div
          className={`${
            tag === TYPE_TAG.DATE ? "block" : "hidden"
          } w-full rounded-xl py-5`}
        >
          <SelectDate
            type="date"
            title="Select Date"
            name="date"
            className="w-2/12 mb-5"
            value={selectDate || ""}
            onSelect={onSelectDate}
          />

          <h3 className="text-lg font-medium text-center">Thu nhập ngày: {growDate.date}</h3>
         
          <div
            className={`grid md:grid-cols-4 grid-cols-1 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300 mt-5`}
          >
            <div className="flex flex-col items-center w-full bg-[#5032fd] text-white px-5 py-10 rounded-xl gap-2">
              <BiDollarCircle className="text-4xl" />
              <p className="md:text-xl text-lg text-center font-medium">
                Thu nhập tạm tính
              </p>
              <SpringCount
                className="text-2xl font-bold"
                from={0}
                specialCharacter="VND"
                to={growDate.sub_gross}
              />
            </div>
            <div className="flex flex-col items-center w-full bg-[#5032fd] text-white px-5 py-10 rounded-xl gap-2">
              <BiDollarCircle className="text-4xl" />
              <p className="md:text-xl text-lg text-center font-medium">
                Tổng thu nhập
              </p>
              <SpringCount
                className="text-2xl font-bold"
                from={0}
                specialCharacter="VND"
                to={growDate.gross}
              />
            </div>
            <div className="flex flex-col items-center w-full bg-[#0891b2] text-white px-5 py-10 rounded-xl gap-2">
              <AiOutlineShoppingCart className="text-4xl" />
              <p className="md:text-xl text-lg text-center font-medium">
                Tổng đơn hàng
              </p>
              <SpringCount
                className="text-2xl font-bold"
                from={0}
                to={growDate.orders}
              />
            </div>
            <div className="flex flex-col items-center w-full bg-success text-white px-5 py-10 rounded-xl gap-2">
              <BiPackage className="text-4xl" />
              <p className="md:text-xl text-lg text-center font-medium">
                Tổng đơn hàng thành công
              </p>
              <SpringCount
                className="text-2xl font-bold"
                from={0}
                to={growDate.delivered_orders}
              />
            </div>
            {/* <div className="flex flex-col items-center w-full bg-warn text-white px-5 py-10 rounded-xl gap-2">
                <BiAlarm className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Orders Pending
                </p>
                {!loadingGrowDate && (
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
                {!loadingGrowDate && (
                  <SpringCount
                    className="text-2xl font-bold"
                    from={0}
                    to={overviews.processing_orders}
                  />
                )}
              </div> */}
            <div className="flex flex-col items-center w-full bg-cancle text-white px-5 py-10 rounded-xl gap-2">
              <BiMinusCircle className="text-4xl" />
              <p className="md:text-xl text-lg text-center font-medium">
                Tổng đơn hàng hủy
              </p>
              <SpringCount
                className="text-2xl font-bold"
                from={0}
                to={growDate.cancle_orders}
              />
            </div>
          </div>
        </div>
        {/* )} */}
        {tag === TYPE_TAG.MONTH && (
          <div className="w-full rounded-xl py-5">
            <SelectItem
              width="w-2/12"
              title="Select month"
              name="month"
              value={selectMonth.month.toString()}
              data={MONTH}
              onSelect={onSelectMonth}
            />

            <p className="text-lg font-medium text-center">
              Thu nhập tháng {selectMonth.month} năm {selectMonth.year}
            </p>
            <Bar ref={chartMonthRef} options={options} data={dataBar} />
          </div>
        )}
      </div>
    </section>
  );
}

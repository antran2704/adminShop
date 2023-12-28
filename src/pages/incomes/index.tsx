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
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
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

interface IGrow {
  gross: number;
  sub_gross: number;
  orders: number;
  delivered_orders: number;
  cancle_orders: number;
  updatedAt?: string | null;
}

interface IGrowDate extends IGrow {
  date: string;
}

interface ISelectGrowMonth {
  month: string;
  year: string;
}

interface ISelectGrowYear {
  year: string;
}

const initOverview: IGrow = {
  gross: 0,
  sub_gross: 0,
  orders: 0,
  cancle_orders: 0,
  delivered_orders: 0,
  updatedAt: null,
};

const initOverviewDate: IGrowDate = {
  ...initOverview,
  date: new Date().toLocaleDateString(),
};

const initSelectGrowMonth: ISelectGrowMonth = {
  month: (new Date().getMonth() + 1).toString(),
  year: new Date().getFullYear().toString(),
};

const initSelectGrowYear: ISelectGrowYear = {
  year: new Date().getFullYear().toString(),
};

const initYears: ISelectItem[] = [
  {
    _id: new Date().getFullYear().toString(),
    title: new Date().getFullYear().toString(),
  },
];

const MONTHS: ISelectItem[] = [
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

  const chartMonthRef = useRef<any>();
  const chartYearRef = useRef<any>();

  const [tag, setTag] = useState<TYPE_TAG>(TYPE_TAG.DATE);

  const [years, setYears] = useState<ISelectItem[]>(initYears);

  const [dataBarMonth, setDataBarMonth] = useState<any>(data);
  const [dataBarYear, setDataBarYear] = useState<any>(data);

  const [growDate, setGrowDate] = useState<IGrowDate>(initOverviewDate);
  const [growMonth, setGrowMonth] = useState<IGrow>(initOverview);
  const [growYear, setGrowYear] = useState<IGrow>(initOverview);

  const [selectDate, setSelectDate] = useState<string>(
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`
  );
  const [selectGrowMonth, setSelectGrowMonth] =
    useState<ISelectGrowMonth>(initSelectGrowMonth);

  const [selectGrowYear, setSelectGrowYear] =
    useState<ISelectGrowYear>(initSelectGrowYear);

  const onSelecTag = (value: string) => {
    if (value === TYPE_TAG.MONTH && !growMonth.updatedAt) {
      handleGetGrossMonth(selectGrowMonth.month, selectGrowMonth.year);
      handleGetGrossInMonth(selectGrowMonth.month, selectGrowMonth.year);
    }

    if (value === TYPE_TAG.YEAR && !growYear.updatedAt) {
      handleGetGrossYear(selectGrowYear.year);
      handleGetGrossInYear(selectGrowYear.year);
    }

    setTag(value as TYPE_TAG);
  };

  const onSelectDate = (value: string) => {
    handleGetGrossDate(value);
    setSelectDate(value);
  };

  const onChangeGrowYear = (value: string, name: string) => {
    handleGetGrossMonth(selectGrowMonth.month, value);
    handleGetGrossInMonth(selectGrowMonth.month, value);

    setSelectGrowMonth({ ...selectGrowMonth, [name]: value });
  };

  const onChangeGrowMonth = (value: string, name: string) => {
    if (name === "year") {
      handleGetGrossMonth(selectGrowMonth.month, value);
      handleGetGrossInMonth(selectGrowMonth.month, value);
    }

    if (name === "month") {
      handleGetGrossMonth(value, selectGrowMonth.year);
      handleGetGrossInMonth(value, selectGrowMonth.year);
    }

    setSelectGrowMonth({ ...selectGrowMonth, [name]: value });
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
      console.log(error);
    }
  };

  const handleGetGrossMonth = async (month: string, year: string) => {
    try {
      const { status, payload } = await axiosGet(
        `/gross-month?gross_month=${month}&gross_year=${year}`
      );

      if (status === 200) {
        setGrowMonth({
          gross: payload.gross,
          orders: payload.orders,
          sub_gross: payload.sub_gross || 0,
          cancle_orders: payload.cancle_orders || 0,
          delivered_orders: payload.delivered_orders || 0,
          updatedAt: payload.updatedAt,
        });
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setGrowMonth({
          ...initOverview,
          updatedAt: null,
        });
      }
      console.log(error);
    }
  };

  const handleGetGrossInMonth = async (month: string, year: string) => {
    try {
      const { status, payload } = await axiosGet(
        `/gross-date/month?gross_month=${month}&gross_year=${year}`
      );
      if (status === 200) {
        const days = new Date(2023, Number(month), 0).getDate();
        const newData: any = data;
        for (let i = 1; i <= days; i++) {
          newData.labels.push(`${i}/${month}`);
          newData.datasets[0].data.push(0);
          newData.datasets[1].data.push(0);
        }
        payload.map((item: any) => {
          const day = Number(item.day);
          newData.datasets[0].data[day - 1] = item.sub_gross;
          newData.datasets[1].data[day - 1] = item.gross;
        });
        chartMonthRef.current.update();
        setDataBarMonth(newData);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleGetGrossInYear = async (year: string) => {
    try {
      const { status, payload } = await axiosGet(
        `/gross-month/year?gross_year=${year}`
      );

      if (status === 200) {
        const newData: any = data;
        
        for (let i = 1; i <= MONTHS.length; i++) {
          newData.labels.push(i);
          newData.datasets[0].data.push(0);
          newData.datasets[1].data.push(0);
        }

        payload.map((item: any) => {
          const month = Number(item.month);
          newData.datasets[0].data[month - 1] = item.sub_gross;
          newData.datasets[1].data[month - 1] = item.gross;
        });
        chartYearRef.current.update();
        setDataBarYear(newData);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleGetGrossYear = async (year: string) => {
    try {
      const { status, payload } = await axiosGet(
        `/gross-year/year?gross_year=${year}`
      );

      if (status === 200) {
        setGrowYear({
          gross: payload.gross,
          orders: payload.orders,
          sub_gross: payload.sub_gross || 0,
          cancle_orders: payload.cancle_orders || 0,
          delivered_orders: payload.delivered_orders || 0,
          updatedAt: payload.updatedAt,
        });
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setGrowYear({
          ...initOverview,
          updatedAt: null,
        });
      }
      console.log(error);
    }
  };

  const handleGetYear = async () => {
    try {
      const { status, payload } = await axiosGet("/gross-year?year=1");
      if (status === 200 && payload.length > 0) {
        const items: ISelectItem[] = payload.map((item: any) => ({
          _id: item.year,
          title: item.year,
        }));

        setYears(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetGrossDate(new Date().toString());
    handleGetYear();
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
            value={TYPE_TAG.WEEK}
            title="Week"
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
          <SelectTag
            size="L"
            value="year"
            title="Year"
            onSelect={onSelecTag}
            currentSelect={tag}
          />
        </div>
      </div>

      <div className="w-full gap-10">
        <div
          className={`${
            tag === TYPE_TAG.DATE ? "block" : "hidden"
          } w-full rounded-xl py-5`}
        >
          <SelectDate
            type="date"
            title="Select Date"
            name="date"
            className="lg:w-2/12 md:w-3/12 w-5/12 mb-5"
            value={selectDate || ""}
            onSelect={onSelectDate}
          />

          <div>
            <h3 className="text-lg font-medium text-center">
              Thu nhập ngày: {growDate.date}
            </h3>
            {growDate.updatedAt && (
              <p className="text-lg font-medium text-center">
                (Dữ liệu cập nhật lúc{" "}
                {new Date(growDate.updatedAt).toLocaleTimeString()} ngày{" "}
                {new Date(growDate.updatedAt).toLocaleDateString("en-GB")})
              </p>
            )}
            {!growDate.updatedAt && (
              <p className="text-lg font-medium text-center">Chưa có dữ liệu</p>
            )}
          </div>
          <div
            className={`grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300 mt-5`}
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
                Đơn hàng thành công
              </p>
              <SpringCount
                className="text-2xl font-bold"
                from={0}
                to={growDate.delivered_orders}
              />
            </div>
            <div className="flex flex-col items-center w-full bg-cancle text-white px-5 py-10 rounded-xl gap-2">
              <BiMinusCircle className="text-4xl" />
              <p className="md:text-xl text-lg text-center font-medium">
                Đơn hàng hủy
              </p>
              <SpringCount
                className="text-2xl font-bold"
                from={0}
                to={growDate.cancle_orders}
              />
            </div>
          </div>
        </div>

        {tag === TYPE_TAG.WEEK && (
          <div className="w-full rounded-xl py-5">
            <div className="flex items-center gap-5">
              <input type="week" onChange={(e) => console.log(e.target.valueAsDate?.toLocaleDateString("en-GB"))}/>
            </div>

            {/* <div className="mt-5">
              <p className="text-lg font-medium text-center">
                Thu nhập tháng {selectGrowMonth.month} năm{" "}
                {selectGrowMonth.year}
              </p>
              {growMonth.updatedAt && (
                <p className="text-lg font-medium text-center">
                  (Dữ liệu cập nhật lúc{" "}
                  {new Date(growMonth.updatedAt).toLocaleTimeString()} ngày{" "}
                  {new Date(growMonth.updatedAt).toLocaleDateString("en-GB")})
                </p>
              )}
              {!growMonth.updatedAt && (
                <p className="text-lg font-medium text-center">
                  Chưa có dữ liệu
                </p>
              )}
            </div>
            <Bar ref={chartMonthRef} options={options} data={dataBarMonth} />

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 my-5 gap-2">
              <div className="flex flex-col items-center w-full bg-[#5032fd] text-white px-5 py-10 rounded-xl gap-2">
                <BiDollarCircle className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Tổng thu nhập
                </p>
                <SpringCount
                  className="text-2xl font-bold"
                  from={0}
                  specialCharacter="VND"
                  to={growMonth.gross}
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
                  to={growMonth.orders}
                />
              </div>
              <div className="flex flex-col items-center w-full bg-success text-white px-5 py-10 rounded-xl gap-2">
                <BiPackage className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Đơn hàng thành công
                </p>
                <SpringCount
                  className="text-2xl font-bold"
                  from={0}
                  to={growMonth.delivered_orders}
                />
              </div>
              <div className="flex flex-col items-center w-full bg-cancle text-white px-5 py-10 rounded-xl gap-2">
                <BiMinusCircle className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Đơn hàng hủy
                </p>
                <SpringCount
                  className="text-2xl font-bold"
                  from={0}
                  to={growMonth.cancle_orders}
                />
              </div>
            </div> */}
          </div>
        )}

        {tag === TYPE_TAG.MONTH && (
          <div className="w-full rounded-xl py-5">
            <div className="flex items-center gap-5">
              <SelectItem
                width="lg:w-2/12 md:w-3/12 w-5/12"
                title="Select month"
                name="month"
                value={selectGrowMonth.month}
                data={MONTHS}
                onSelect={onChangeGrowMonth}
              />

              <SelectItem
                width="lg:w-2/12 md:w-3/12 w-5/12"
                title="Select year"
                name="year"
                value={selectGrowMonth.year}
                data={years}
                onSelect={onChangeGrowMonth}
              />
            </div>

            <div className="mt-5">
              <p className="text-lg font-medium text-center">
                Thu nhập tháng {selectGrowMonth.month} năm{" "}
                {selectGrowMonth.year}
              </p>
              {growMonth.updatedAt && (
                <p className="text-lg font-medium text-center">
                  (Dữ liệu cập nhật lúc{" "}
                  {new Date(growMonth.updatedAt).toLocaleTimeString()} ngày{" "}
                  {new Date(growMonth.updatedAt).toLocaleDateString("en-GB")})
                </p>
              )}
              {!growMonth.updatedAt && (
                <p className="text-lg font-medium text-center">
                  Chưa có dữ liệu
                </p>
              )}
            </div>
            <Bar ref={chartMonthRef} options={options} data={dataBarMonth} />

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 my-5 gap-2">
              <div className="flex flex-col items-center w-full bg-[#5032fd] text-white px-5 py-10 rounded-xl gap-2">
                <BiDollarCircle className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Tổng thu nhập
                </p>
                <SpringCount
                  className="text-2xl font-bold"
                  from={0}
                  specialCharacter="VND"
                  to={growMonth.gross}
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
                  to={growMonth.orders}
                />
              </div>
              <div className="flex flex-col items-center w-full bg-success text-white px-5 py-10 rounded-xl gap-2">
                <BiPackage className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Đơn hàng thành công
                </p>
                <SpringCount
                  className="text-2xl font-bold"
                  from={0}
                  to={growMonth.delivered_orders}
                />
              </div>
              <div className="flex flex-col items-center w-full bg-cancle text-white px-5 py-10 rounded-xl gap-2">
                <BiMinusCircle className="text-4xl" />
                <p className="md:text-xl text-lg text-center font-medium">
                  Đơn hàng hủy
                </p>
                <SpringCount
                  className="text-2xl font-bold"
                  from={0}
                  to={growMonth.cancle_orders}
                />
              </div>
            </div>
          </div>
        )}

        {tag === TYPE_TAG.YEAR && (
          <div className="w-full rounded-xl py-5">
            <div className="flex items-center gap-5">
              <SelectItem
                width="lg:w-2/12 md:w-3/12 w-5/12"
                title="Select year"
                name="year"
                value={selectGrowYear.year}
                data={years}
                onSelect={onChangeGrowYear}
              />
            </div>

            <div className="mt-5">
              <p className="text-lg font-medium text-center">
                Thu nhập năm {selectGrowYear.year}
              </p>
              {growYear.updatedAt && (
                <p className="text-lg font-medium text-center">
                  (Dữ liệu cập nhật lúc{" "}
                  {new Date(growYear.updatedAt).toLocaleTimeString()} ngày{" "}
                  {new Date(growYear.updatedAt).toLocaleDateString("en-GB")})
                </p>
              )}
              {!growYear.updatedAt && (
                <p className="text-lg font-medium text-center">
                  Chưa có dữ liệu
                </p>
              )}
            </div>
            <Bar ref={chartYearRef} options={options} data={dataBarYear} />
          </div>
        )}
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiDollarCircle, BiPackage, BiMinusCircle } from "react-icons/bi";
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

import Statistic from "~/components/Statistic";
import { axiosGet } from "~/ultils/configAxios";
import { IGrow, IGrowDate } from "~/interface";
import { getEndDayInWeek, getFirstDayInWeek } from "~/helper/datetime";

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
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  maintainAspectRatio: false,
};

const initOverview: IGrow = {
  gross: 0,
  sub_gross: 0,
  orders: 0,
  cancle_orders: 0,
  delivered_orders: 0,
  updatedAt: null,
};

const initOverviewDate: IGrowDate = {
  gross: 0,
  sub_gross: 0,
  orders: 0,
  cancle_orders: 0,
  delivered_orders: 0,
  updatedAt: null,
  date: new Date().toLocaleDateString(),
};

interface ISelectGrowWeek {
  startDay: string;
  endDay: string;
  year: string;
  month: string;
}

const initSelectGrowWeek: ISelectGrowWeek = {
  startDay: "",
  endDay: "",
  year: "",
  month: "",
};

const IncomeWeekPage = () => {
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
  const [dataBarWeek, setDataBarWeek] = useState<any>(data);

  const [growWeek, setGrowWeek] = useState<IGrowDate>(initOverviewDate);
  const [selectGrowWeek, setSelectGrowWeek] =
    useState<ISelectGrowWeek>(initSelectGrowWeek);

  const onSelectWeek = (value: Date) => {
    if (!value) return;

    handleGetGrossInWeek(value);
  };

  const handleGetGrossInWeek = async (startDate: Date) => {
    const endDay = getEndDayInWeek(startDate.toDateString())
      .getDate()
      .toString();
    const month = (startDate.getMonth() + 1).toString();
    const year = startDate.getFullYear().toString();

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
        setGrowWeek(initOverviewDate);
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

        const dataOverview: IGrowDate = payload.reduce(
          (accumulator: IGrow, item: any) => {
            accumulator = {
              gross: accumulator.gross + (item.gross || 0),
              sub_gross: accumulator.sub_gross + (item.sub_gross || 0),
              orders: accumulator.orders + (item.orders.length || 0),
              cancle_orders:
                accumulator.cancle_orders + (item.cancle_orders || 0),
              delivered_orders:
                accumulator.delivered_orders + (item.delivered_orders || 0),
              updatedAt: null,
            };

            return accumulator;
          },
          initOverview
        );

        dataOverview.updatedAt = payload[payload.length - 1].updatedAt;
        dataOverview.date = payload[payload.length - 1].date;

        setGrowWeek(dataOverview);
        setDataBarWeek(newData);
        chartWeekRef.current.update();
      }

      setSelectGrowWeek({ startDay: startDay.toString(), endDay, year, month });
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    const firstDay = getFirstDayInWeek(new Date().toDateString());
    handleGetGrossInWeek(firstDay);
  }, []);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full">
        <h1 className="md:text-3xl text-2xl font-bold">
          {" "}
          Dashboard Overview Income Week
        </h1>
      </div>

      <div className="w-full rounded-xl py-5">
        <div className="lg:w-2/12 md:w-3/12 w-5/12 mb-5">
          <input
            type="week"
            onChange={(e) => onSelectWeek(e.target.valueAsDate as Date)}
            className="w-full min-h-[40px] rounded-md px-2 py-1 border-2 focus:border-[#4f46e5]"
          />
        </div>

        <div className="my-10">
          <p className="text-lg font-medium text-center">
            Thu nhập từ ngày {selectGrowWeek.startDay} đến ngày{" "}
            {selectGrowWeek.endDay} tháng {selectGrowWeek.month} năm{" "}
            {selectGrowWeek.year}
          </p>
          {growWeek.updatedAt && (
            <p className="text-lg font-medium text-center">
              (Dữ liệu cập nhật lúc{" "}
              {new Date(growWeek.updatedAt).toLocaleTimeString()} ngày{" "}
              {new Date(growWeek.updatedAt).toLocaleDateString("en-GB")})
            </p>
          )}
          {!growWeek.updatedAt && (
            <p className="text-lg font-medium text-center">Chưa có dữ liệu</p>
          )}
        </div>

        <div className="flex lg:flex-row flex-col items-start my-5 gap-10">
          <div
            className={`grid md:grid-cols-2 grid-cols-1 lg:w-6/12 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300`}
          >
            <Statistic
              title="Thu nhập tạm tính"
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={growWeek.sub_gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />
            <Statistic
              title="Tổng thu nhập"
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={growWeek.gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />

            <Statistic
              title="Tổng đơn hàng"
              IconElement={<AiOutlineShoppingCart className="text-4xl" />}
              to={growWeek.orders}
              backgroundColor="bg-[#0891b2]"
              duration={0}
            />

            <Statistic
              title="Đơn hàng thành công"
              IconElement={<BiPackage className="text-4xl" />}
              to={growWeek.delivered_orders}
              backgroundColor="bg-success"
              duration={0}
            />

            <Statistic
              title="Đơn hàng thành công"
              IconElement={<BiMinusCircle className="text-4xl" />}
              to={growWeek.cancle_orders}
              backgroundColor="bg-cancle"
              duration={0}
            />
          </div>

          <div className="lg:w-6/12 w-full">
            <Bar
              className="w-full min-h-[400px]"
              ref={chartWeekRef}
              options={options}
              data={dataBarWeek}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncomeWeekPage;

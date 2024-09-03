import { useState, useEffect, useRef, ReactElement } from "react";
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
import dayjs, { Dayjs } from "dayjs";

import Statistic from "~/components/Statistic";
import { IGrossMonth } from "~/interface/gross/month";
import { SelectItem } from "~/components/Select";
import { IGrossDate, IResponse, ISelectItem } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithHeader from "~/layouts/Private";
import {
  getGrossInMonth,
  getStatisticsMonth,
} from "~/api-client/gross/grossMonth";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import DateFilter from "~/components/Core/Filter/Date";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

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

const initOverview: IGrossMonth = {
  sub_gross: 0,
  total_gross: 0,
  month: (new Date().getMonth() + 1).toString(),
  year: new Date().getFullYear().toString(),
  orders: 0,
  cancel_orders: 0,
  delivered_orders: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initYears: ISelectItem[] = [
  {
    _id: new Date().getFullYear().toString(),
    title: new Date().getFullYear().toString(),
  },
];

const Layout = LayoutWithHeader;

const IncomeMonthPage: NextPageWithLayout = () => {
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
  const [dataBarMonth, setDataBarMonth] = useState<any>(data);

  const [years, setYears] = useState<ISelectItem[]>(initYears);
  const [grossMonth, setGrossMonth] = useState<IGrossMonth>(initOverview);

  const onChangeGrowMonth = (value: string, name: string) => {
    if (name === "year") {
      handleGetStatisticsMonth(selectGrowMonth.month, value);
      handleGetGrossInMonth(selectGrowMonth.month, value);
    }

    if (name === "month") {
      handleGetStatisticsMonth(value, selectGrowMonth.year);
      handleGetGrossInMonth(value, selectGrowMonth.year);
    }

    setSelectGrowMonth({ ...selectGrowMonth, [name]: value });
  };

  const onSelectMonth = (value: Dayjs) => {
    console.log(value.startOf("month").toISOString());
    // setSelectDate(dayjs(value.toISOString()).format(DAY_DMY));
  };

  const handleGetStatisticsMonth = async (month: string, year: string) => {
    await getStatisticsMonth(month, year)
      .then(({ payload }: IResponse<IGrossMonth>) => {
        setGrossMonth(payload);
      })
      .catch((err) => {
        const { status } = hanldeErrorAxios(err);

        if (status === 404) {
          setGrossMonth({
            ...grossMonth,
            // createdAt: parseDate,
            updatedAt: null,
          });
        }
      });
  };

  const handleGetGrossInMonth = async (startDate: string, endDate: string) => {
    const { status, payload } = await getGrossInMonth(startDate, endDate);

    if (status === 200) {
      const month = new Date(startDate).getMonth() + 1;
      const days = new Date(2023, Number(month), 0).getDate();
      const newData: any = data;
      for (let i = 1; i <= days; i++) {
        newData.labels.push(`${i}/${month}`);
        newData.datasets[0].data.push(0);
        newData.datasets[1].data.push(0);
      }

      payload.map((item: IGrossDate) => {
        const day = Number(item.day);
        newData.datasets[0].data[day - 1] = item.sub_gross;
        newData.datasets[1].data[day - 1] = item.total_gross;
      });
      chartMonthRef.current.update();
      setDataBarMonth(newData);
    }
  };

  const handleGetYear = async () => {
    const { status, payload } = await axiosGet("/gross-year?year=1");
    if (status === 200 && payload.length > 0) {
      const items: ISelectItem[] = payload.map((item: any) => ({
        _id: item.year,
        title: item.year,
      }));

      setYears(items);
    }
  };

  useEffect(() => {
    const startDate: string = dayjs(new Date().toISOString())
      .startOf("month")
      .toISOString();
    const endDate: string = dayjs(new Date().toISOString())
      .endOf("month")
      .toISOString();

    handleGetStatisticsMonth(startDate, endDate);
    handleGetGrossInMonth(startDate, endDate);
    // handleGetYear();
  }, []);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full">
        <h1 className="md:text-3xl text-2xl font-bold dark:text-darkText">
          {" "}
          Dashboard Overview Income Month
        </h1>
      </div>

      <div className="w-full rounded-xl py-5">
        <div className="flex items-center gap-5">
          <DateFilter
            className="lg:w-2/12 md:w-3/12 w-5/12 mb-5"
            picker="month"
            // value={selectDate ? dayjs(selectDate, DAY_DMY) : null}
            onChangeDate={onSelectMonth}
          />

          {/* <SelectItem
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
          /> */}
        </div>

        <div className="my-5">
          <p className="text-lg font-medium text-center dark:text-darkText">
            Thu nhập tháng {selectGrowMonth.month} năm {selectGrowMonth.year}
          </p>
          {grossMonth.updatedAt && (
            <p className="text-lg font-medium text-center dark:text-darkText">
              (Dữ liệu cập nhật lúc{" "}
              {new Date(grossMonth.updatedAt).toLocaleTimeString()} ngày{" "}
              {new Date(grossMonth.updatedAt).toLocaleDateString("en-GB")})
            </p>
          )}
          {!grossMonth.updatedAt && (
            <p className="text-lg font-medium text-center dark:text-darkText">
              Chưa có dữ liệu
            </p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="lg:w-11/12 w-full">
            <Bar
              className="w-full min-h-[600px] bg-white p-5 rounded-md"
              ref={chartMonthRef}
              options={options}
              data={dataBarMonth}
            />
          </div>
        </div>

        <div
          className={`grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300 my-5`}>
          <Statistic
            title="Thu nhập tạm tính"
            IconElement={<BiDollarCircle className="text-4xl" />}
            to={grossMonth.sub_gross}
            backgroundColor="bg-[#5032fd]"
            duration={0}
            specialCharacter="VND"
          />
          <Statistic
            title="Tổng thu nhập"
            IconElement={<BiDollarCircle className="text-4xl" />}
            to={grossMonth.total_gross}
            backgroundColor="bg-[#5032fd]"
            duration={0}
            specialCharacter="VND"
          />

          <Statistic
            title="Tổng đơn hàng"
            IconElement={<AiOutlineShoppingCart className="text-4xl" />}
            to={grossMonth.orders}
            backgroundColor="bg-[#0891b2]"
            duration={0}
          />

          <Statistic
            title="Đơn hàng thành công"
            IconElement={<BiPackage className="text-4xl" />}
            to={grossMonth.delivered_orders}
            backgroundColor="bg-success"
            duration={0}
          />

          <Statistic
            title="Đơn hàng thành công"
            IconElement={<BiMinusCircle className="text-4xl" />}
            to={grossMonth.cancel_orders}
            backgroundColor="bg-cancle"
            duration={0}
          />
        </div>
      </div>
    </section>
  );
};

export default IncomeMonthPage;

IncomeMonthPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

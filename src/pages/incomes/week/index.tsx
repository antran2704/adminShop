import { useState, useEffect, useRef, ReactElement } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiDollarCircle, BiPackage, BiMinusCircle } from "react-icons/bi";
import { ChartData, ChartOptions } from "chart.js";
import dayjs, { Dayjs } from "dayjs";

import Statistic from "~/components/Statistic";
import { IGrossDate } from "~/interface/gross/date";

import { NextPageWithLayout } from "~/interface/page";
import LayoutWithHeader from "~/layouts/Private";
import { getGrossInMonth } from "~/api-client/gross/grossMonth";
import { IResponseWithPagination } from "~/interface";
import DateFilter from "~/components/Core/Filter/Date";
import { DAY_DMY } from "~/common/format/dateTime";
import { useTranslations } from "next-intl";
import { formatDate } from "~/helper/format/datetime";
import { ChartCore } from "~/components/Core";

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
};

const initOverview: IGrossDate = {
  sub_gross: 0,
  total_gross: 0,
  day: new Date().getDate().toString(),
  month: (new Date().getMonth() + 1).toString(),
  year: new Date().getFullYear().toString(),
  orders: 0,
  cancel_orders: 0,
  delivered_orders: 0,
  createdAt: null,
  updatedAt: null,
};

const Layout = LayoutWithHeader;

const IncomeWeekPage: NextPageWithLayout = () => {
  const t = useTranslations("GrossMonthPage");
  const tGross = useTranslations("Gross");
  const tCommon = useTranslations("Common");

  const data: ChartData<"bar"> = {
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
  const [dataBarWeek, setDataBarWeek] = useState<ChartData<"bar">>(data);

  const [grossWeek, setGrossWeek] = useState<IGrossDate>(initOverview);
  const [selectWeek, setSelectWeek] = useState<Dayjs>(
    dayjs(new Date().toISOString()),
  );

  const onSelectWeek = (value: Dayjs) => {
    setSelectWeek(value);
  };

  const handleGetGrossInWeek = async (startDate: string, endDate: string) => {
    await getGrossInMonth(startDate, endDate).then(
      ({ payload }: IResponseWithPagination<IGrossDate[]>) => {
        const startDay = selectWeek.startOf("week").date();
        const newData: any = data;

        for (let i = 0; i <= 6; i++) {
          const nextDay = new Date();
          nextDay.setDate(startDay + i);
          newData.labels.push(nextDay.getDate());
          newData.datasets[0].data[i] = 0;
          newData.datasets[1].data[i] = 0;
        }

        if (payload.length === 0) {
          setGrossWeek(initOverview);
          setDataBarWeek(newData);
          chartWeekRef.current.update();

          return;
        }

        payload.map((item: IGrossDate) => {
          const day = Number(item.day);
          const index = newData.labels.findIndex(
            (label: number) => label === day,
          );
          newData.datasets[0].data[index] = item.sub_gross;
          newData.datasets[1].data[index] = item.total_gross;
        });

        const dataOverview: IGrossDate = payload.reduce(
          (accumulator: IGrossDate, item: any) => {
            accumulator = {
              ...accumulator,
              total_gross: accumulator.total_gross + (item.gross || 0),
              sub_gross: accumulator.sub_gross + (item.sub_gross || 0),
              orders: accumulator.orders + (item.orders.length || 0),
              cancel_orders:
                accumulator.cancel_orders + (item.cancel_orders || 0),
              delivered_orders:
                accumulator.delivered_orders + (item.delivered_orders || 0),
              updatedAt: null,
            };

            return accumulator;
          },
          initOverview,
        );

        dataOverview.updatedAt = payload[payload.length - 1].updatedAt;
        dataOverview.createdAt = payload[payload.length - 1].createdAt;

        setGrossWeek(dataOverview);
        setDataBarWeek(newData);
        chartWeekRef.current.update();
      },
    );
  };

  useEffect(() => {
    handleGetGrossInWeek(
      selectWeek.startOf("week").toISOString(),
      selectWeek.endOf("week").toISOString(),
    );
  }, [selectWeek]);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <h1 className="md:text-2xl text-xl dark:text-darkText font-medium">
        {t("title")}
      </h1>

      <div className="w-full rounded-xl py-2">
        <DateFilter
          className="lg:w-2/12 md:w-3/12 w-5/12 mb-5"
          picker="week"
          allowClear={false}
          value={selectWeek ? selectWeek : null}
          onChangeDate={(_, option: Dayjs) => onSelectWeek(option)}
        />

        <div className="my-5">
          <p className="text-lg font-medium text-center dark:text-darkText">
            {`${tGross("grossIn")} ${dayjs(selectWeek.startOf("week")).format(DAY_DMY)} - ${dayjs(selectWeek.endOf("week")).format(DAY_DMY)}`}
          </p>

          {grossWeek.updatedAt && (
            <p className="text-lg font-medium text-center dark:text-darkText">
              {`${tGross("updatedAt")} ${formatDate(grossWeek.updatedAt)}`}
            </p>
          )}

          {!grossWeek.updatedAt && (
            <p className="text-lg font-medium text-center dark:text-darkText">
              {tCommon("noData")}
            </p>
          )}
        </div>

        <div className="flex lg:flex-row flex-col items-start my-5 gap-10">
          <div className="lg:w-6/12 w-full bg-white p-5 rounded-md">
            <ChartCore
              ref={chartWeekRef}
              type="bar"
              options={options}
              data={dataBarWeek}
              className="w-full min-h-[400px]"
            />
          </div>
          <div
            className={`grid md:grid-cols-2 grid-cols-1 lg:w-6/12 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300`}>
            <Statistic
              title={tGross("subTotal")}
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={grossWeek.sub_gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />
            <Statistic
              title={tGross("total")}
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={grossWeek.total_gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />

            <Statistic
              title={tGross("order")}
              IconElement={<AiOutlineShoppingCart className="text-4xl" />}
              to={grossWeek.orders}
              backgroundColor="bg-[#0891b2]"
              duration={0}
            />

            <Statistic
              title={tGross("successOrder")}
              IconElement={<BiPackage className="text-4xl" />}
              to={grossWeek.delivered_orders}
              backgroundColor="bg-success"
              duration={0}
            />

            <Statistic
              title={tGross("cancelOrder")}
              IconElement={<BiMinusCircle className="text-4xl" />}
              to={grossWeek.cancel_orders}
              backgroundColor="bg-cancle"
              duration={0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncomeWeekPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

IncomeWeekPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

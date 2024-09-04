import { useState, useEffect, useRef, ReactElement } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiDollarCircle, BiPackage, BiMinusCircle } from "react-icons/bi";
import { ChartData, ChartOptions } from "chart.js";
import dayjs, { Dayjs } from "dayjs";

import Statistic from "~/components/Statistic";
import { ChartCore } from "~/components/Core";
import LayoutWithHeader from "~/layouts/Private";

import { IGrossMonth } from "~/interface/gross/month";
import { IGrossDate, IResponse } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import {
  getGrossInMonth,
  getStatisticsMonth,
} from "~/api-client/gross/grossMonth";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import DateFilter from "~/components/Core/Filter/Date";
import { useTranslations } from "next-intl";
import { formatDate } from "~/helper/format/datetime";

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

const initOverview: IGrossMonth = {
  sub_gross: 0,
  total_gross: 0,
  month: (new Date().getMonth() + 1).toString(),
  year: new Date().getFullYear().toString(),
  orders: 0,
  cancel_orders: 0,
  delivered_orders: 0,
  createdAt: null,
  updatedAt: null,
};

const Layout = LayoutWithHeader;

const IncomeMonthPage: NextPageWithLayout = () => {
  const t = useTranslations("GrossMonthPage");
  const tGross = useTranslations("Gross");
  const tCommon = useTranslations("Common");

  const data: ChartData<"bar"> = {
    labels: [],
    datasets: [
      {
        label: tGross("subGross"),
        data: [],
        backgroundColor: "rgb(255, 99, 132)",
        borderRadius: 10,
        borderWidth: 0,
      },
      {
        label: tGross("gross"),
        data: [],
        backgroundColor: "rgb(75, 192, 192)",
        borderRadius: 10,
        borderWidth: 0,
      },
    ],
  };

  const chartMonthRef = useRef<any>();
  const [dataBarMonth, setDataBarMonth] = useState<ChartData<"bar">>(data);

  const [selectGross, setSelectGross] = useState<{
    startDate: Dayjs;
    endDate: Dayjs;
  }>({
    startDate: dayjs(new Date().toISOString()),
    endDate: dayjs(new Date().toISOString()),
  });
  const [grossMonth, setGrossMonth] = useState<IGrossMonth>(initOverview);

  const onSelectMonth = (value: Dayjs) => {
    setSelectGross({ startDate: value, endDate: value });
  };

  const handleGetStatisticsMonth = async (month: string, year: string) => {
    await getStatisticsMonth(month, year)
      .then(({ payload }: IResponse<IGrossMonth>) => {
        setGrossMonth(payload);
      })
      .catch((err) => {
        const { status } = hanldeErrorAxios(err);

        if (status === 404) {
          setGrossMonth(initOverview);
        }
      });
  };

  const handleGetGrossInMonth = async (startDate: string, endDate: string) => {
    await getGrossInMonth(startDate, endDate)
      .then(({ payload }: IResponse<IGrossDate[]>) => {
        const month = (selectGross.startDate.get("month") + 1).toString();
        const days = selectGross.endDate.endOf("month").date();
        const newData: any = { ...data };

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
        setDataBarMonth(newData);
      })
      .catch(() => {
        setDataBarMonth(data);
      });

    chartMonthRef.current.update();
  };

  useEffect(() => {
    handleGetStatisticsMonth(
      (selectGross.startDate.get("month") + 1).toString(),
      selectGross.startDate.get("years").toString(),
    );
    handleGetGrossInMonth(
      selectGross.startDate.startOf("month").toISOString(),
      selectGross.endDate.endOf("month").toISOString(),
    );
  }, [selectGross]);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <h1 className="md:text-2xl text-xl dark:text-darkText font-medium">
        {t("title")}
      </h1>

      <div className="w-full rounded-xl py-2">
        <div className="flex items-center gap-5">
          <DateFilter
            className="lg:w-2/12 md:w-3/12 w-5/12 mb-5"
            picker="month"
            allowClear={false}
            value={selectGross.startDate ? selectGross.startDate : null}
            onChangeDate={(_, option: Dayjs) => onSelectMonth(option)}
          />
        </div>

        <div className="my-5">
          <p className="text-lg font-medium text-center dark:text-darkText">
            {tGross("grossIn")} {selectGross.startDate.get("month") + 1}/
            {selectGross.startDate.get("year")}
          </p>
          {grossMonth.updatedAt && (
            <p className="text-lg text-center dark:text-darkText">
              {`${tGross("updatedAt")} ${formatDate(grossMonth.updatedAt)}`}
            </p>
          )}
          {!grossMonth.updatedAt && (
            <p className="text-lg font-medium text-center dark:text-darkText">
              {tCommon("noData")}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="lg:w-11/12 w-full">
            <ChartCore
              ref={chartMonthRef}
              type="bar"
              options={options}
              data={dataBarMonth}
              className="w-full min-h-[600px] bg-white p-5 rounded-md"
            />
          </div>
        </div>

        <div
          className={`grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300 my-5`}>
          <Statistic
            title={tGross("subTotal")}
            IconElement={<BiDollarCircle className="text-4xl" />}
            to={grossMonth.sub_gross}
            backgroundColor="bg-[#5032fd]"
            duration={0}
            specialCharacter="VND"
          />
          <Statistic
            title={tGross("total")}
            IconElement={<BiDollarCircle className="text-4xl" />}
            to={grossMonth.total_gross}
            backgroundColor="bg-[#5032fd]"
            duration={0}
            specialCharacter="VND"
          />

          <Statistic
            title={tGross("order")}
            IconElement={<AiOutlineShoppingCart className="text-4xl" />}
            to={grossMonth.orders}
            backgroundColor="bg-[#0891b2]"
            duration={0}
          />

          <Statistic
            title={tGross("successOrder")}
            IconElement={<BiPackage className="text-4xl" />}
            to={grossMonth.delivered_orders}
            backgroundColor="bg-success"
            duration={0}
          />

          <Statistic
            title={tGross("cancelOrder")}
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

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

IncomeMonthPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

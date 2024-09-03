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
import { IGrossYear } from "~/interface/gross/year";
import { SelectItem } from "~/components/Select";
import { IResponse, ISelectItem } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";
import { PrivateLayout } from "~/layouts";
import {
  getGrossInYear,
  getStatisticsYear,
} from "~/api-client/gross/grossYear";
import { IGrossMonth } from "~/interface/gross/month";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import DateFilter from "~/components/Core/Filter/Date";
import { useTranslations } from "next-intl";
import { formatDate } from "~/helper/format/datetime";

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

const initOverview: IGrossYear = {
  sub_gross: 0,
  total_gross: 0,
  year: new Date().getFullYear().toString(),
  orders: 0,
  cancel_orders: 0,
  delivered_orders: 0,
  createdAt: null,
  updatedAt: null,
};

const Layout = PrivateLayout;

const IncomeYearPage: NextPageWithLayout = () => {
  const t = useTranslations("GrossYearPage");
  const tGross = useTranslations("Gross");
  const tCommon = useTranslations("Common");

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

  const chartYearRef = useRef<any>();
  const [dataBarYear, setDataBarYear] = useState<any>(data);

  const [grossYear, setGrossYear] = useState<IGrossYear>(initOverview);
  const [selectGross, setSelectGross] = useState<{
    year: Dayjs;
  }>({
    year: dayjs(new Date().toISOString()),
  });

  const onSelectYear = (value: Dayjs) => {
    setSelectGross({ year: value });
  };

  const handleGetGrossInYear = async (year: string) => {
    await getGrossInYear(year)
      .then(({ payload }: IResponse<IGrossMonth[]>) => {
        const newData: any = data;

        for (let i = 1; i <= MONTHS.length; i++) {
          newData.labels.push(i);
          newData.datasets[0].data.push(0);
          newData.datasets[1].data.push(0);
        }

        payload.map((item: IGrossMonth) => {
          const month = Number(item.month);
          newData.datasets[0].data[month - 1] = item.sub_gross;
          newData.datasets[1].data[month - 1] = item.total_gross;
        });
        setDataBarYear(newData);
      })
      .catch(() => {
        setDataBarYear(data);
      });

    chartYearRef.current.update();
  };

  const handleGetStatistics = async (year: string) => {
    await getStatisticsYear(year)
      .then(({ payload }: IResponse<IGrossYear>) => {
        setGrossYear(payload);
      })
      .catch((err) => {
        const { status } = hanldeErrorAxios(err);

        if (status === 404) {
          setGrossYear(initOverview);
        }
      });
  };

  useEffect(() => {
    handleGetStatistics(selectGross.year.get("year").toString());
    handleGetGrossInYear(selectGross.year.get("year").toString());
  }, [selectGross]);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full">
        <h1 className="md:text-2xl text-xl dark:text-darkText font-medium">
          {t("title")}
        </h1>
      </div>

      <div className="w-full rounded-xl py-5">
        <div className="flex items-center gap-5">
          <DateFilter
            className="lg:w-2/12 md:w-3/12 w-5/12 mb-5"
            picker="year"
            allowClear={false}
            value={selectGross.year ? selectGross.year : null}
            onChangeDate={(_, option: Dayjs) => onSelectYear(option)}
          />
        </div>

        <div className="mt-5">
          <p className="text-lg font-medium text-center dark:text-darkText">
            {tGross("grossIn")} {selectGross.year.get("year")}
          </p>
          {grossYear.updatedAt && (
            <p className="text-lg text-center dark:text-darkText">
              {`${tGross("updatedAt")} ${formatDate(grossYear.updatedAt)}`}
            </p>
          )}
          {!grossYear.updatedAt && (
            <p className="text-lg font-medium text-center dark:text-darkText">
              {tCommon("noData")}
            </p>
          )}
        </div>
        <div className="flex lg:flex-row flex-col items-start my-5 gap-10">
          <div className="lg:w-6/12 w-full bg-white p-5 rounded-md">
            <Bar
              ref={chartYearRef}
              className="w-full min-h-[400px]"
              options={options}
              data={dataBarYear}
            />
          </div>
          <div
            className={`grid md:grid-cols-2 grid-cols-1 lg:w-6/12 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300`}>
            <Statistic
              title={tGross("subTotal")}
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={grossYear.sub_gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />
            <Statistic
              title={tGross("total")}
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={grossYear.total_gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />

            <Statistic
              title={tGross("order")}
              IconElement={<AiOutlineShoppingCart className="text-4xl" />}
              to={grossYear.orders}
              backgroundColor="bg-[#0891b2]"
              duration={0}
            />

            <Statistic
              title={tGross("successOrder")}
              IconElement={<BiPackage className="text-4xl" />}
              to={grossYear.delivered_orders}
              backgroundColor="bg-success"
              duration={0}
            />

            <Statistic
              title={tGross("cancelOrder")}
              IconElement={<BiMinusCircle className="text-4xl" />}
              to={grossYear.cancel_orders}
              backgroundColor="bg-cancle"
              duration={0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncomeYearPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

IncomeYearPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

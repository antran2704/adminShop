import {
  useState,
  useEffect,
  useRef,
  ReactElement,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  BiCircleThreeQuarter,
  BiDollarCircle,
  BiPackage,
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
  ChartOptions,
  ChartData,
} from "chart.js";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

import { ChartCore } from "~/components/Core";
import SpringCount from "~/components/SpringCount";
import Statistic from "~/components/Statistic";
import { PrivateLayout } from "~/layouts";

import { IGross, IGrossDate, IResponse } from "~/interface";
import { IOrder, IOrderTable, ISearchOrder } from "~/interface/order";
import { NextPageWithLayout } from "~/interface/page";

import { ORDER_PARAMATER_ENUM } from "~/enums";

import { countOrders, getOrders } from "~/api-client";
import { getGross, getGrossInWeek } from "~/api-client/gross/gross-date";

import { getFirstDayInWeek } from "~/helper/format/datetime";
import { ENUM_ORDER_STATUS } from "~/enums/order";
import { OrderTable } from "~/components/OrderPage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Overview in week",
    },
  },
  maintainAspectRatio: false,
};

const initGross: IGross = {
  total_gross: 0,
  orders: 0,
  cancel_orders: 0,
  delivered_orders: 0,
  sub_gross: 0,
};

const Layout = PrivateLayout;

const HomePage: NextPageWithLayout = () => {
  const t = useTranslations("HomePage");
  const tOrder = useTranslations("OrderPage");
  const tGross = useTranslations("Common.gross");

  const router = useRouter();

  const chartWeekRef = useRef<any>();

  // data for chart
  const data: ChartData<"bar"> = useMemo(() => {
    return {
      labels: [],
      datasets: [
        {
          label: tGross("subTotal"),
          data: [],
          backgroundColor: "rgb(255, 99, 132)",
          borderRadius: 10,
          borderWidth: 0,
        },
        {
          label: tGross("total"),
          data: [],
          backgroundColor: "rgb(75, 192, 192)",
          borderRadius: 10,
          borderWidth: 0,
        },
      ],
    };
  }, [router.locale]);

  const [grossToday, setGrossToday] = useState<IGross>(initGross);
  const [dataBarWeek, setDataBarWeek] = useState<ChartData<"bar">>(data);
  const [totalWeek, setTotalWeek] = useState<number>(0);

  const [orders, setOrders] = useState<IOrderTable[]>([]);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [processingOrders, setProcessingOrders] = useState<number>(0);

  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetGrossToday = async () => {
    const date = new Date().toISOString();

    getGross(date)
      .then(({ status, payload }: IResponse<IGross>) => {
        if (status === 200) {
          setGrossToday(payload);
        }
      })
      .catch((err) => err);
  };

  const handleGetGrossInWeek = async (startDate: Date) => {
    try {
      const { status, payload } = await getGrossInWeek(startDate.toISOString());

      const startDay = startDate.getDate();
      const newData: ChartData<"bar"> = data;
      let total: number = 0;

      for (let i = 0; i <= 6; i++) {
        const nextDay = new Date();
        nextDay.setDate(startDay + i);
        (newData.labels as number[]).push(nextDay.getDate());
        newData.datasets[0].data[i] = 0;
        newData.datasets[1].data[i] = 0;
      }

      if (payload.length === 0) {
        setDataBarWeek(newData);
        setTotalWeek(0);
        chartWeekRef.current.update();
      }

      if (status === 200 && payload.length > 0) {
        payload.map((item: IGrossDate) => {
          const day = Number(item.day);
          const index = (newData.labels as number[]).findIndex(
            (label: number) => label === day,
          );

          if (index) {
            newData.datasets[0].data[index] = item.sub_gross;
            newData.datasets[1].data[index] = item.total_gross;
            total += item.sub_gross;
          }
        });

        setTotalWeek(total);
        setDataBarWeek(newData);
        chartWeekRef.current.update();
      }
    } catch (error: any) {
      return error;
    }
  };

  const handleCountOrders = async (
    statusOrder: ENUM_ORDER_STATUS,
    callback: Dispatch<SetStateAction<number>>,
  ) => {
    countOrders(statusOrder)
      .then(({ status, payload }: IResponse<number>) => {
        if (status === 200) {
          callback(payload);
        }
      })
      .catch((err) => err);
  };

  const handleGetOrder = async (paramater: ISearchOrder) => {
    setLoading(true);

    await getOrders(paramater).then(
      ({ status, payload }: IResponse<IOrder[]>) => {
        if (status === 200) {
          const ordersTable: IOrderTable[] = payload.map((order) => ({
            key: order._id,
            id: order.order_id,
            customer: order.address.shipping_name,
            total: order.total,
            orderStatus: order.order_status,
            paymentMethod: order.payment_method,
            createdAt: order.createdAt,
          }));

          setOrders(ordersTable);
        }
      },
    );

    setLoading(false);
  };

  useEffect(() => {
    // get Gross in today
    handleGetGrossToday();

    // count orders with PENDING status
    handleCountOrders(ENUM_ORDER_STATUS.PENDING, setPendingOrders);

    // count orders with PROCESS status
    handleCountOrders(ENUM_ORDER_STATUS.PROCESS, setProcessingOrders);

    // get orders
    handleGetOrder({ order: ORDER_PARAMATER_ENUM.DESC, page: 1, take: 16 });
  }, []);

  useEffect(() => {
    const firstDay = getFirstDayInWeek(new Date().toDateString());
    // get Gross in week
    handleGetGrossInWeek(firstDay);
  }, [router.locale]);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full h-[10%] mb-5">
        <h1 className="dark:text-darkText md:text-3xl text-2xl font-bold mb-1">
          {t("title")}
        </h1>
        <p className="dark:text-darkText text-lg font-medium">
          {t("subTitle")}
        </p>
      </div>
      <div className="w-full lg:mb-10 mb-5">
        <h2 className="text-title mb-4 dark:text-darkText">
          {t("dashBoard.overview")}
        </h2>
        <div className="h-full gap-10">
          <div className="relative w-full mb-10">
            <div
              className={`grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full h-full md:max-h-max ${
                show ? "max-h-[2000px]" : "max-h-[600px]"
              } gap-2 overflow-hidden transition-all ease-in-out duration-300`}>
              <Statistic
                title={tGross("totalToday")}
                IconElement={<BiDollarCircle className="text-4xl" />}
                to={grossToday.total_gross}
                backgroundColor="bg-[#5032fd]"
                duration={0.5}
                specialCharacter="VND"
              />

              <Statistic
                title={tGross("orderToday")}
                IconElement={<AiOutlineShoppingCart className="text-4xl" />}
                to={grossToday.orders}
                backgroundColor="bg-[#0891b2]"
                duration={0.5}
              />

              <Statistic
                title={tGross("successOrder")}
                IconElement={<BiPackage className="text-4xl" />}
                to={grossToday.delivered_orders}
                backgroundColor="bg-[#0891b2]"
                duration={0.5}
              />

              <Statistic
                title={tGross("pendingOrder")}
                IconElement={<BiPackage className="text-4xl" />}
                to={pendingOrders}
                backgroundColor="bg-warn"
                duration={0.5}
              />

              <Statistic
                title={tGross("processOrder")}
                IconElement={<BiCircleThreeQuarter className="text-4xl" />}
                to={processingOrders}
                backgroundColor="bg-primary"
                duration={0.5}
              />

              <Statistic
                title={tGross("cancelOrder")}
                IconElement={<BiMinusCircle className="text-4xl" />}
                to={grossToday.cancel_orders}
                backgroundColor="bg-cancle"
                duration={0.5}
              />
            </div>

            <button
              onClick={() => setShow(!show)}
              className="md:hidden block absolute -bottom-10 left-1/2 -translate-x-1/2 select-none">
              {!show && (
                <MdOutlineKeyboardDoubleArrowDown className="text-3xl text-primary" />
              )}
              {show && (
                <MdOutlineKeyboardDoubleArrowUp className="text-3xl text-primary" />
              )}
            </button>
          </div>
          <div className="lg:w-3/4 w-full h-full bg-[#f4f7ff] rounded-xl p-5 mx-auto">
            <div>
              <p>{t("income.subTotal")}</p>
              <SpringCount
                className="text-lg font-bold"
                from={0}
                to={totalWeek}
                specialCharacter="VND"
                duration={0.5}
              />
            </div>
            <div className="py-5 rounded-md">
              <ChartCore
                ref={chartWeekRef}
                type="bar"
                data={dataBarWeek}
                options={options}
                className="min-h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-title dark:text-darkText">
            {tOrder("recentOrder")}
          </h2>
          <Link
            href={"/orders"}
            className="text-base font-medium text-primary hover:underline">
            View All
          </Link>
        </div>

        {/* Table orders */}
        <OrderTable data={orders} loading={loading} showPagination={false} />
      </div>
    </section>
  );
};

export default HomePage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../messages/${context.locale}.json`)).default,
    },
  };
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

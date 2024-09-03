import { useTranslations } from "next-intl";
import { useState, useEffect, ReactElement } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiDollarCircle, BiPackage, BiMinusCircle } from "react-icons/bi";
import dayjs, { Dayjs } from "dayjs";

import { getGross } from "~/api-client/gross/grossDate";

import DateFilter from "~/components/Core/Filter/Date";
import Statistic from "~/components/Statistic";
import { formatDate } from "~/helper/format/datetime";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

import { IResponse } from "~/interface";
import { IGrossDate } from "~/interface/gross/date";
import { NextPageWithLayout } from "~/interface/page";
import { PrivateLayout } from "~/layouts";
import { DAY_DMY } from "~/common/format/dateTime";

const initOverviewDate: IGrossDate = {
  sub_gross: 0,
  total_gross: 0,
  day: new Date().getDate().toString(),
  month: (new Date().getMonth() + 1).toString(),
  year: new Date().getFullYear().toString(),
  orders: 0,
  cancel_orders: 0,
  delivered_orders: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const Layout = PrivateLayout;

const IncomeDatePage: NextPageWithLayout = () => {
  const t = useTranslations("GrossDatePage");
  const tCommon = useTranslations("Common");

  const [growDate, setGrowDate] = useState<IGrossDate>(initOverviewDate);
  const [selectDate, setSelectDate] = useState<string>(
    dayjs(new Date().toISOString()).format(DAY_DMY),
  );

  const onSelectDate = (value: Dayjs) => {
    setSelectDate(dayjs(value.toISOString()).format(DAY_DMY));
  };

  const handleGetGrossDate = async (date: string) => {
    const parseDate: string = dayjs(date, DAY_DMY).toISOString();

    await getGross(parseDate)
      .then(({ payload }: IResponse<IGrossDate>) => setGrowDate(payload))
      .catch((err) => {
        const { status } = hanldeErrorAxios(err);

        if (status === 404) {
          setGrowDate({
            ...initOverviewDate,
            createdAt: parseDate,
            updatedAt: null,
          });
        }
      });
  };

  useEffect(() => {
    handleGetGrossDate(selectDate);
  }, [selectDate]);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 pt-5 overflow-auto gap-5">
      <div className="w-full">
        <h1 className="md:text-3xl text-2xl dark:text-darkText font-bold">
          {t("title")}
        </h1>
      </div>

      <div className="w-full gap-10">
        <div className="w-full rounded-xl py-5">
          {/* <DateFilter value={selectDate || ""} onSelect={onSelectDate} /> */}
          <DateFilter
            className="lg:w-2/12 md:w-3/12 w-5/12 mb-5"
            format={DAY_DMY}
            value={selectDate ? dayjs(selectDate, DAY_DMY) : null}
            onChangeDate={(_, value: Dayjs) => onSelectDate(value)}
          />

          <div>
            <h3 className="text-lg text-center dark:text-darkText">
              {t("grossIn")}: {formatDate(growDate.createdAt as string)}
            </h3>
            {growDate.updatedAt && (
              <p className="text-lg text-center dark:text-darkText">
                {`${t("updatedAt")} ${formatDate(growDate.updatedAt)}`}
              </p>
            )}
            {!growDate.updatedAt && (
              <p className="text-lg text-center dark:text-darkText">
                {tCommon("noData")}
              </p>
            )}
          </div>
          <div
            className={`grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full h-full md:max-h-max gap-2 overflow-hidden transition-all ease-in-out duration-300 mt-5`}>
            <Statistic
              title={t("subTotal")}
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={growDate.sub_gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />
            <Statistic
              title={t("total")}
              IconElement={<BiDollarCircle className="text-4xl" />}
              to={growDate.total_gross}
              backgroundColor="bg-[#5032fd]"
              duration={0}
              specialCharacter="VND"
            />

            <Statistic
              title={t("order")}
              IconElement={<AiOutlineShoppingCart className="text-4xl" />}
              to={growDate.orders}
              backgroundColor="bg-[#0891b2]"
              duration={0}
            />

            <Statistic
              title={t("successOrder")}
              IconElement={<BiPackage className="text-4xl" />}
              to={growDate.delivered_orders}
              backgroundColor="bg-success"
              duration={0}
            />

            <Statistic
              title={t("cancelOrder")}
              IconElement={<BiMinusCircle className="text-4xl" />}
              to={growDate.cancel_orders}
              backgroundColor="bg-cancle"
              duration={0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncomeDatePage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

IncomeDatePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

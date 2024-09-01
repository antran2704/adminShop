import { useEffect, useState, Fragment, ReactElement } from "react";

import { IOrder, IOrderTable, ISearchOrder } from "~/interface/order";
import { IPagination } from "~/interface/pagination";

import ShowItemsLayout from "~/layouts/ManagerLayout";
import { ORDER_PARAMATER_ENUM } from "~/enums";
import { IResponseWithPagination, ISearch } from "~/interface";
import { initPagination } from "~/components/Pagination/initData";
import { getOrders } from "~/api-client";
import { NextPageWithLayout } from "~/interface/page";
import { PrivateLayout } from "~/layouts";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import { useTranslations } from "next-intl";
import { message } from "antd";
import { OrderTable } from "~/components/OrderPage";

const Layout = PrivateLayout;

const OrdersPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { query } = router;

  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 2;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;

  const t = useTranslations("OrderPage");
  const tError = useTranslations("Error");

  const [orders, setOrders] = useState<IOrderTable[]>([]);

  const [paramater, setParamter] = useState<ISearch>({
    take: takeParam,
    page: pageParam,
    search: searchParam as string,
    order: orderParam as ORDER_PARAMATER_ENUM,
  });

  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [loading, setLoading] = useState<boolean>(true);
  console.log("pagination", pagination);
  const [messageApi, contextHolder] = message.useMessage();

  const onChangePage = (page: number, pageSize: number) => {
    setParamter({ ...paramater, page, take: pageSize });
    router.replace({
      query: { ...router.query, page, take: pageSize },
    });
  };

  const handleGetData = async (paramater: ISearchOrder) => {
    setLoading(true);

    await getOrders(paramater)
      .then(({ payload, pagination }: IResponseWithPagination<IOrder[]>) => {
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
        setPagination(pagination);
      })
      .catch(() => messageApi.error(tError("TRY_AGAIN")));

    setLoading(false);
  };

  useEffect(() => {
    handleGetData(paramater);
  }, [paramater]);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <ShowItemsLayout
      title={t("title")}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
        },
      ]}>
      <Fragment>
        <OrderTable
          data={orders}
          loading={loading}
          pagination={pagination}
          onChangePage={onChangePage}
        />

        {/* Message of antd */}
        {contextHolder}
      </Fragment>
    </ShowItemsLayout>
  );
};

export default OrdersPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

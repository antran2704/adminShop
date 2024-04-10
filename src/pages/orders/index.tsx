import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import {
  useEffect,
  useState,
  useCallback,
  Fragment,
  ReactElement,
} from "react";

import { IOrder } from "~/interface/order";
import { IPagination } from "~/interface/pagination";

import { colHeadOrder as colHeadTable } from "~/components/Table/colHeadTable";
import Search from "~/components/Search";
import ShowItemsLayout from "~/layouts/ShowItemsLayout";
import { CelTable, Table } from "~/components/Table";
import { typeCel } from "~/enums";
import { orderStatus } from "~/components/Table/statusCel";
import { ButtonEdit } from "~/components/Button";
import { IFilter, ISelectItem } from "~/interface";
import { SelectDate, SelectItem } from "~/components/Select";
import { formatBigNumber } from "~/helper/number/fomatterCurrency";
import { initPagination } from "~/components/Pagination/initData";
import { getOrders, getOrdersWithFilter } from "~/api-client";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { useTranslation } from "react-i18next";

interface Props {
  query: InferGetServerSidePropsType<typeof getServerSideProps>;
}

const dataFilterStatus: ISelectItem[] = [
  {
    _id: "delivered",
    title: "delivered",
  },
  {
    _id: "pending",
    title: "pending",
  },
  {
    _id: "cancle",
    title: "cancle",
  },
  {
    _id: "processing",
    title: "processing",
  },
];

const dataFilterMethod: ISelectItem[] = [
  {
    _id: "cash",
    title: "Cash",
  },
  {
    _id: "banking",
    title: "Banking",
  },
  {
    _id: "cod",
    title: "Cod",
  },
  {
    _id: "vnpay",
    title: "VNPay",
  },
];

const Layout = LayoutWithHeader;

const OrdersPage: NextPageWithLayout<Props> = (props: Props) => {
  const { query } = props;
  const currentPage = query.page ? Number(query.page) : 1;

  const { t, i18n } = useTranslation();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<IFilter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onChangeSearch = useCallback(
    (name: string, value: string) => {
      setFilter({ ...filter, [name]: value });
    },
    [filter]
  );

  const onSelect = useCallback(
    (value: string, name: string) => {
      setFilter({ ...filter, [name]: value });
    },
    [filter]
  );

  const onReset = useCallback(() => {
    setFilter(null);

    if (!currentPage || currentPage === 1) {
      handleGetData();
    }
  }, [filter, currentPage]);

  const handleGetDataByFilter = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOrdersWithFilter(filter, currentPage);

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setOrders([]);
          setMessage(`No data`);
        } else {
          setMessage(null);
          setOrders(response.payload);
        }
      }

      setPagination(response.pagination);
      setLoading(false);
    } catch (error) {
      setOrders([]);
      setPagination(initPagination);
      setMessage(`No order`);
      setLoading(false);
    }
  }, [filter, currentPage]);

  const handleGetData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOrders(currentPage);
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setOrders([]);
          setMessage(`No Data`);
        } else {
          setMessage(null);
          setOrders(response.payload);
        }
      }

      setPagination(response.pagination);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setOrders([]);
      setMessage(`No Data`);
      setPagination(initPagination);
      setLoading(false);
    }
  }, [filter, currentPage]);

  useEffect(() => {
    console.log("currentPage:::", currentPage);

    if (filter) {
      handleGetDataByFilter();
    } else {
      handleGetData();
    }
  }, [currentPage]);

  return (
    <ShowItemsLayout title="Orders" pagination={pagination}>
      <Fragment>
        <Search
          search={filter?.search || ""}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFilter={handleGetDataByFilter}
          placeholder="Search by customer name/order ID..."
        >
          <Fragment>
            <SelectItem
              width="lg:w-2/12 md:w-4/12 w-full"
              placeholder="Status"
              name="status"
              value={filter?.status || ""}
              data={dataFilterStatus}
              onSelect={onSelect}
            />
            <SelectItem
              width="lg:w-2/12 md:w-4/12 w-full"
              placeholder="Payment Method"
              name="payment_method"
              value={filter?.payment_method || ""}
              data={dataFilterMethod}
              onSelect={onSelect}
            />

            <SelectDate
              className="lg:w-2/12 md:w-4/12 w-full"
              title="Start Date"
              name="start_date"
              value={filter?.start_date || ""}
              type="date"
              onSelect={onSelect}
            />
            <SelectDate
              className="lg:w-2/12 md:w-4/12 w-full"
              title="End Date"
              name="end_date"
              value={filter?.end_date || ""}
              type="date"
              onSelect={onSelect}
            />
          </Fragment>
        </Search>

        <Table
          colHeadTabel={colHeadTable[i18n.resolvedLanguage as string]}
          items={orders}
          loading={loading}
          message={message}
          pagination={pagination}
        >
          <Fragment>
            {orders.map((order: IOrder) => (
              <tr
                key={order._id}
                className="hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-white border-b border-gray-300 last:border-none"
              >
                <CelTable
                  type={typeCel.LINK}
                  className="whitespace-nowrap"
                  value={order.order_id}
                  center={true}
                  href={`/orders/${order.order_id}`}
                />
                <CelTable
                  type={typeCel.TEXT}
                  className="whitespace-nowrap"
                  value={order.user_infor.name}
                />
                <CelTable
                  center={true}
                  type={typeCel.TEXT}
                  className="capitalize"
                  value={order.payment_method}
                />
                <CelTable
                  center={true}
                  type={typeCel.TEXT}
                  value={`${formatBigNumber(order.total)} VND`}
                />
                <CelTable
                  type={typeCel.STATUS}
                  value={order.status}
                  status={orderStatus[order.status]}
                />
                <CelTable
                  center={true}
                  type={typeCel.DATE}
                  value={order.createdAt}
                />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-center">
                    <ButtonEdit link={`/orders/${order.order_id}`} />
                  </div>
                </CelTable>
              </tr>
            ))}
          </Fragment>
        </Table>
      </Fragment>
    </ShowItemsLayout>
  );
};

export default OrdersPage;

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { query } };
};

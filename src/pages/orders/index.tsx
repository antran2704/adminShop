import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState, useCallback, Fragment, ChangeEvent } from "react";
import { axiosGet } from "~/ultils/configAxios";

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
import { currencyFormat } from "~/helper/currencyFormat";
import { useRouter } from "next/router";

interface Props {
  query: InferGetServerSidePropsType<typeof getServerSideProps>;
}

const initPagination: IPagination = {
  currentPage: 1,
  pageSize: 0,
  totalItems: 0,
};

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
    _id: "card",
    title: "Card",
  },
];

const OrdersPage = (props: Props) => {
  const { query } = props;
  const currentPage = query.page ? query.page : 1;

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<IFilter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const name = e.target.name;

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
    handleGetData();
  }, [filter, orders]);

  const handleGetDataByFilter = useCallback(async () => {
    console.log("fillrer")
    setLoading(true);
    try {
      const response = await axiosGet(
        `${process.env.NEXT_PUBLIC_ENDPOINT_API}/orders/search?search=${
          filter?.search || ""
        }&status=${filter?.status || ""}&payment_method=${
          filter?.payment_method || ""
        }&start_date=${filter?.start_date || ""}&end_date=${
          filter?.end_date || ""
        }&page=${currentPage}`
      );

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
      console.log(error);
      setOrders([]);
      setPagination(initPagination);
      setMessage(`No order`);
      setLoading(false);
    }
  }, [filter, currentPage]);

  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await axiosGet(`/orders?page=${currentPage}`);
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
  };

  useEffect(() => {
    if (filter) {
      handleGetDataByFilter();
    } else {
      handleGetData();
    }
  }, [currentPage]);

  return (
    <ShowItemsLayout
      title="Orders"
      titleCreate="Create order"
      pagination={pagination}
    >
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

        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <Fragment>
            {orders.map((order: IOrder) => (
              <tr
                key={order._id}
                className="hover:bg-slate-100 border-b border-gray-300"
              >
                <CelTable
                  type={typeCel.TEXT}
                  className="whitespace-nowrap"
                  value={order.order_id}
                  center={true}
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
                  value={`${currencyFormat(order.total)} VND`}
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
                    <ButtonEdit link={`/orders/${order._id}`} />
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { query } };
};

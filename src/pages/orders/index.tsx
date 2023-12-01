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
import { IFilter } from "~/interface";

interface Props {
  query: InferGetServerSidePropsType<typeof getServerSideProps>;
}

const initPagination: IPagination = {
  currentPage: 1,
  pageSize: 0,
  totalItems: 0,
};

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

  const onReset = useCallback(() => {
    setFilter(null);
    handleGetData();
  }, [filter, orders]);

  const handleGetDataByFilter = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosGet(
        `${process.env.NEXT_PUBLIC_ENDPOINT_API}/orders/search?search=${
          filter?.search || ""
        }&page=${currentPage}`
      );

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setOrders([]);
          setMessage(`No category`);
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
  }, [filter]);

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
    handleGetData();
  }, []);

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
          placeholder="Search by category name..."
        />

        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <Fragment>
            {orders.map((order: IOrder) => (
              <tr
                key={order._id}
                className="hover:bg-slate-100 border-b border-gray-300"
              >
                <CelTable type={typeCel.TEXT} value={order._id} />
                <CelTable type={typeCel.TEXT} value={order.user_infor.name} />
                <CelTable
                  center={true}
                  type={typeCel.TEXT}
                  value={order.user_infor.email}
                />
                <CelTable
                  center={true}
                  type={typeCel.TEXT}
                  value={order.user_infor.phoneNumber}
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

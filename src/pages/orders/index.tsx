import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState, useCallback } from "react";
import { axiosGet } from "~/ultils/configAxios";

import { IOrder } from "~/interface/order";
import { IPagination } from "~/interface/pagination";

import TableOrder from "~/components/Table/TableOrder";
import Search from "~/components/Search";

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
  const currentPage = query.page || 1;
  const search = query.search;
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const handleSearch = useCallback(
    async (value: string) => {

      setLoading(true);
      try {
        const response = await axiosGet(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/order/search?search=${value}&page=${currentPage}`
        );

        if (response.status === 200) {
          if (response.payload.length === 0) {
            setOrders([]);
            setMessage(`No category with text ${value}`);
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
        setMessage(`No order with text ${value}`);
        setLoading(false);
      }
    },
    [search]
  );

  const getOrders = async (currentPage: string) => {
    setLoading(true);
    try {
      const response = await axiosGet(
        `/order/getAllOrders?page=${currentPage}`
      );
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
    if (search) {
      handleSearch(search);
    }
  }, []);

  useEffect(() => {
    if (!search) {
      getOrders(currentPage);
    }
  }, [currentPage]);

  return (
    <section className="lg:py-5 px-5 py-24">
      <div className="w-full mb-5">
        <h1 className="lg:text-3xl text-2xl font-bold">List orders</h1>
      </div>
      <div>
        <Search
          onSearch={handleSearch}
          placeholder="Search with name, phone, email"
        />
        <TableOrder
          message={message}
          loading={loading}
          orders={orders}
          pagination={pagination}
        />
      </div>
    </section>
  );
};

export default OrdersPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { query } };
};

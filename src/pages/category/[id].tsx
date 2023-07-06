import Link from "next/link";
import { GetServerSideProps } from "next";
import { useState, useEffect, useCallback, Fragment } from "react";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";

import { IDataTable } from "~/interface/table";
import { IProductData } from "~/interface/product";

import Search from "~/components/Search";
import Table from "~/components/Table";
import Pagination from "~/components/Pagination";
import { deleteImageInSever } from "~/helper/handleImage";

interface Props {
  query: any;
}

const colHeadTable = ["Name", "Thumnail", "Status", "Created Date", ""];

const CategoryItem = (props: Props) => {
  const { id } = props.query;
  const [products, setProducts] = useState<IDataTable[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handlePopup = useCallback(() => {
    setShowPopup(!showPopup);
  }, [products, showPopup]);

  const handleGetData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios
        .get(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/product/getAllProductsInCategory/${id}`
        )
        .then((payload) => payload.data);

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setProducts([]);
          setMessage("No item in category");
          setLoading(false);
          return;
        }
        const data: IDataTable[] = response.payload.map(
          (item: IProductData) => {
            return {
              _id: item._id,
              title: item.title,
              slug: item.slug,
              thumbnail: item.thumbnail,
              createdAt: item.createdAt,
            };
          }
        );
        setProducts(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoading(false);
    }
  }, [products]);

  const handleDeleteProduct = useCallback(
    async (item: IDataTable) => {
      if (!item._id) {
        setShowPopup(false);
        return;
      }

      try {
        await deleteImageInSever(item.thumbnail);
        await axios
          .delete(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/product/${item._id}`)
          .then((res) => res.data);
        setShowPopup(false);
        handleGetData();
      } catch (error) {
        console.log(error);
      }
    },
    [products]
  );

  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <section className="lg:pt-10 px-5 pt-24">
      <div className="flex items-center justify-between gap-5">
        <h1 className="lg:text-3xl text-2xl font-bold">Categories</h1>
        <Link
          href={"/add/product"}
          className="block font-medium bg-primary px-3 py-2 rounded-md"
        >
          <IoIosAdd className=" text-2xl text-white" />
        </Link>
      </div>

      <Fragment>
        <Search />
        <Table
          colHeadTabel={colHeadTable}
          data={products}
          message={message}
          loading={loading}
          onDelete={handleDeleteProduct}
          showPopup={showPopup}
          onShowPopup={() => setShowPopup(!showPopup)}
        />
        {products.length > 0 && <Pagination />}
      </Fragment>
    </section>
  );
};

export default CategoryItem;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

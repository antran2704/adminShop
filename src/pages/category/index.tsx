import Link from "next/link";
import { useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosAdd } from "react-icons/io";

import { IDataTable } from "~/interface/table";
import { IDataCategory } from "~/interface/category";

import { deleteImageInSever } from "~/helper/handleImage";

import Search from "~/components/Search";
import Table from "~/components/Table";
import Pagination from "~/components/Pagination";

// Title for tabel
const colHeadTable = ["Name", "Thumnail", "Status", "Created Date", ""];

const Category = () => {
  const [categories, setCategories] = useState<IDataTable[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handlePopup = useCallback(() => {
    setShowPopup(!showPopup);
  }, [categories, showPopup]);

  const handleGetData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios
        .get(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/getAllCategories`
        )
        .then((payload) => payload.data);

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setCategories([]);
          setMessage("No category");
          setLoading(false);
          return;
        }

        const data: IDataTable[] = response.payload.map(
          (item: IDataCategory) => {
            return {
              _id: item._id,
              title: item.title,
              slug: item.slug,
              thumbnail: item.thumbnail,
              createdAt: item.createdAt,
            };
          }
        );

        setCategories(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoading(false);
    }
  }, [categories]);

  const handleDeleteCategory = useCallback(
    async (item: IDataTable) => {
      if (!item._id) {
        setShowPopup(false);
        toast.error("False delete category", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      try {
        await deleteImageInSever(item.thumbnail);
        await axios
          .delete(
            `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/${item._id}`
          )
          .then((res) => res.data);
        setShowPopup(false);
        handleGetData();
        toast.success("Success delete category", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        toast.error("Error delete category", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(error);
      }
    },
    [categories]
  );

  const handleSearch = async (text: string) => {
    setLoading(true);
    try {
      const response = await axios
        .get(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/search?search=${text}`
        )
        .then((payload) => payload.data);

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setCategories([]);
          setMessage(`No category with text ${text}`);
          setLoading(false);
          return;
        }

        const data: IDataTable[] = response.payload.map(
          (item: IDataCategory) => {
            return {
              _id: item._id,
              title: item.title,
              slug: item.slug,
              thumbnail: item.thumbnail,
              createdAt: item.createdAt,
            };
          }
        );
        setMessage(null);
        setCategories(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage(`No category with text ${text}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <section className="lg:pt-10 px-5 pt-24">
      <div className="flex items-center justify-between gap-5">
        <h1 className="lg:text-3xl text-2xl font-bold">Categories</h1>
        <Link
          href={"/add/category"}
          className="block font-medium bg-primary px-3 py-2 rounded-md"
        >
          <IoIosAdd className=" text-2xl text-white" />
        </Link>
      </div>

      <Fragment>
        <Search onSearch={handleSearch} />
        <Table
          colHeadTabel={colHeadTable}
          data={categories}
          href="/category"
          hrefEdit="/edit/category"
          message={message}
          loading={loading}
          onDelete={handleDeleteCategory}
          showPopup={showPopup}
          onShowPopup={handlePopup}
        />
        {categories.length > 0 && <Pagination />}
      </Fragment>
    </section>
  );
};

export default Category;

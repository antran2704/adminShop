import Link from "next/link";
import { useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";

import { typeCel } from "~/enums";

import { productStatus } from "~/components/Table/statusCel";

import { IDataTable } from "~/interface/table";
import { IDataCategory } from "~/interface/category";

import { deleteImageInSever } from "~/helper/handleImage";

import Search from "~/components/Search";
import Table from "~/components/Table";
import Pagination from "~/components/Pagination";
import CelTable from "~/components/Table/CelTable";
import { colHeadCategory as colHeadTable } from "~/components/Table/colHeadTable";
import Popup from "~/components/Popup";

const initData: IDataTable = {
  _id: null,
  title: "",
  slug: "",
  thumbnail: "",
  createdAt: "",
};

// Title for tabel
const Category = () => {
  const [categories, setCategories] = useState<IDataTable[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<IDataTable>(initData);

  const onSelectDeleteItem = (item: IDataTable) => {
    setSelectItem(item);
    handlePopup();
  };

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

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
    <section className="lg:py-5 px-5 py-24">
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
        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <Fragment>
            {categories.map((item: IDataTable) => (
              <tr key={item._id} className="hover:bg-slate-100 border-b border-gray-300">
                <CelTable
                  type={typeCel.LINK}
                  value={item.title}
                  href={`/category/${item._id}`}
                />
                <CelTable
                  type={typeCel.THUMBNAIL}
                  value={item.thumbnail}
                  href={`/category/${item._id}`}
                />
                <CelTable type={typeCel.STATUS} value={"public"} status={productStatus["public"]}/>
                <CelTable type={typeCel.DATE} value={item.createdAt} />
                <CelTable
                  type={typeCel.BUTTON_LINK}
                  href={`/edit/category/${item.slug}`}
                  value={""}
                  icon={<AiOutlineEdit className="text-xl" />}
                />
                <CelTable
                  type={typeCel.BUTTON}
                  value={""}
                  onClick={() => onSelectDeleteItem(item)}
                  icon={<AiOutlineDelete className="text-xl" />}
                />
              </tr>
            ))}
          </Fragment>
        </Table>
        {categories.length > 0 && <Pagination />}
      </Fragment>

      <Popup show={showPopup} onClose={handlePopup}>
        <div>
          <p className="text-lg">
            Do you want delete category <strong>{selectItem?.title}</strong>
          </p>
          <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-2 lg:gap-5 gap-2">
            <button
              onClick={() => handleDeleteCategory(selectItem)}
              className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
            >
              Delete
            </button>
            <button
              onClick={handlePopup}
              className="lg:w-fit w-full text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
            >
              Cancle
            </button>
          </div>
        </div>
      </Popup>
    </section>
  );
};

export default Category;

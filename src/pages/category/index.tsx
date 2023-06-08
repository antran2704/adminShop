import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoAdd } from "react-icons/io5";

import ButtonShowMore from "~/components/Button/ButtonShowMore";
import Popup from "~/components/Popup";
import { ICategory } from "./interface";

const Category = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [message, setMessage] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingShowMore, setLoadingShowMore] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleGetData = async () => {
    setLoading(true);

    try {
      const data = await axios
        .get(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/getAllCategories`
        )
        .then((payload) => payload.data);
      setCategories(data.payload);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string | null) => {
    if (!id) {
      setShowPopup(false);
      return;
    }

    try {
      await axios
        .delete(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/${id}`)
        .then((res) => res.data);
      setShowPopup(false);
      handleGetData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 lg:pt-5 pt-24 overflow-auto gap-5">
      <div className="w-full flex items-center justify-between mb-1 gap-10">
        <h1 className="lg:text-3xl text-2xl font-bold">All Categories</h1>
        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className=" text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
          >
            Edit
          </button>
        )}
        {isEdit && (
          <button
            onClick={() => setIsEdit(false)}
            className=" text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
          >
            Cancle
          </button>
        )}
      </div>

      <ul className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 w-full gap-5">
        {categories.length > 0 &&
          categories.map((item: ICategory) => (
            <li
              key={item._id}
              className="block p-5 hover:shadow-lg bg-gray-50 border border-gray-300 rounded-lg transition-all ease-linear duration-200"
            >
              <Link href={`/category/${item.slug}`}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-[300px] rounded-xl"
                />
                <p className="text-base font-medium text-[#1e1e1e] text-center mt-3 truncate">
                  {item.title}
                </p>
              </Link>
              {isEdit && (
                <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-2 lg:gap-5 gap-2">
                  <button
                    onClick={() => {
                      setCategoryId(item._id);
                      setShowPopup(true);
                    }}
                    className="lg:w-fit w-full text-lg text-center text-white font-medium bg-error px-5 py-1 rounded-md"
                  >
                    Delete
                  </button>
                  <Link href={`/edit/category/${item.slug}`} className="lg:w-fit w-full text-lg text-center text-white font-medium bg-primary px-5 py-1 rounded-md">
                    Edit
                  </Link>
                </div>
              )}
            </li>
          ))}

        {isEdit && (
          <Link
            href={"/add/category"}
            className="flex items-center justify-center p-5 bg-gray-50 border border-gray-300 rounded-lg transition-all ease-linear duration-200"
          >
            <IoAdd className="md:text-6xl text-4xl" />
          </Link>
        )}

        {loading &&
          [...new Array(8)].map((item, index: number) => (
            <li key={index}>
              <div className="block p-5 bg-gray-50 border border-gray-300 rounded-lg transition-all ease-linear duration-200">
                <div className="skelaton w-full h-[300px] rounded-xl"></div>
                <p className="skelaton h-5 text-base font-medium text-[#1e1e1e] text-center mt-3 rounded-md"></p>
              </div>
            </li>
          ))}
      </ul>

      <p className="w-full text-2xl text-center font-medium text-[#e91e63]">
        {message}
      </p>

      {categories.length > 12 && (
        <ButtonShowMore loading={loadingShowMore} onClick={handleGetData} />
      )}

      <Popup show={showPopup} onClose={() => setShowPopup(!showPopup)}>
        <div>
          <p className="text-lg">Do you want delete category {categoryId}</p>
          <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-2 lg:gap-5 gap-2">
            <button
              onClick={() => handleDeleteCategory(categoryId)}
              className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
            >
              Delete
            </button>
            <button className="lg:w-fit w-full text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
              Edit
            </button>
          </div>
        </div>
      </Popup>
    </section>
  );
};

export default Category;

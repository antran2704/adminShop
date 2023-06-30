import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";

import { IDataCategory } from "~/interface/category";
import CategoryLayout from "~/layouts/CategoryLayout";
import { deleteImageInSever } from "~/helper/handleImage";

const Category = () => {
  const [categories, setCategories] = useState<IDataCategory[]>([]);
  const [message, setMessage] = useState<string>("");
  const [categorySelect, setCategorySelect] = useState<IDataCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

  const handleDeleteCategory = async (item: IDataCategory) => {
    if (!item._id) {
      setShowPopup(false);
      return;
    }

    try {
      await deleteImageInSever(item.thumbnail);
      await axios
        .delete(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/${item._id}`)
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
    <CategoryLayout
      item={categorySelect}
      title="All Categories"
      linkAddItem="/add/category"
      message={message}
      loading={loading}
      isEdit={isEdit}
      isShowPopup={showPopup}
      onEdit={() => setIsEdit(!isEdit)}
      onShowPopup={() => setShowPopup(!showPopup)}
      onDeleteItem={handleDeleteCategory}
    >
      <Fragment>
        {categories.length > 0 &&
          categories.map((item: IDataCategory) => (
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
                      setCategorySelect(item);
                      setShowPopup(true);
                      console.log(item)
                    }}
                    className="lg:w-fit w-full text-lg text-center text-white font-medium bg-error px-5 py-1 rounded-md"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/edit/category/${item.slug}`}
                    className="lg:w-fit w-full text-lg text-center text-white font-medium bg-primary px-5 py-1 rounded-md"
                  >
                    Edit
                  </Link>
                </div>
              )}
            </li>
          ))}
      </Fragment>
    </CategoryLayout>
  );
};

export default Category;

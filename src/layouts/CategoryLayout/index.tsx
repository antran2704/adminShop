import Link from "next/link";
import { useState, useEffect, FC } from "react";
import { IoAdd } from "react-icons/io5";

import { ICategory } from "~/pages/category/interface";
import ButtonShowMore from "~/components/Button/ButtonShowMore";
import Popup from "~/components/Popup";

interface prop {
  children: JSX.Element;
  item: ICategory | null;
  title: string;
  message: string;
  linkAddItem: string;
  loading: boolean;
  isEdit: boolean;
  isShowPopup: boolean;
  onEdit: () => void;
  onShowPopup: () => void;
  onDeleteItem: (item: ICategory) => void;
}

const CategoryLayout: FC<prop> = (prop: prop) => {
  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 lg:pt-5 pt-24 overflow-auto gap-5">
      <div className="w-full flex items-center justify-between mb-1 gap-10">
        <h1 className="lg:text-3xl text-2xl font-bold">{prop.title}</h1>
        {!prop.isEdit && (
          <button
            onClick={prop.onEdit}
            className=" text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
          >
            Edit
          </button>
        )}
        {prop.isEdit && (
          <button
            onClick={prop.onEdit}
            className=" text-lg text-white font-medium bg-primary px-5 py-1 rounded-md"
          >
            Cancle
          </button>
        )}
      </div>

      <ul className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 w-full gap-5">
        {prop.children}

        {prop.isEdit && (
          <Link
            href={prop.linkAddItem}
            className="flex items-center justify-center p-5 bg-gray-50 border border-gray-300 rounded-lg transition-all ease-linear duration-200"
          >
            <IoAdd className="md:text-6xl text-4xl" />
          </Link>
        )}

        {prop.loading &&
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
        {prop.message}
      </p>

      {/* {categories.length > 12 && (
        <ButtonShowMore loading={loadingShowMore} onClick={handleGetData} />
      )} */}

      <Popup show={prop.isShowPopup} onClose={prop.onShowPopup}>
        <div>
          <p className="text-lg">Do you want delete category {prop.item?._id}</p>
          <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-2 lg:gap-5 gap-2">
            <button
              onClick={() => prop.onDeleteItem(prop.item)}
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

export default CategoryLayout;

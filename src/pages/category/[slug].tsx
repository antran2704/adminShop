import Link from "next/link";
import { GetServerSideProps } from "next";
import { Fragment, useState } from "react";

import { ICategory } from "./interface";
import ButtonShowMore from "~/components/Button/ButtonShowMore";
import CategoryLayout from "~/layouts/CategoryLayout";

interface Props {
  query: any;
}

const CategoryItem = (props: Props) => {
  const { slug } = props.query;
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [message, setMessage] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // const handleGetData = () => {
  //   setLoadingShowMore(true);

  //   setTimeout(() => {
  //     setLoadingShowMore(false);
  //   }, 4000);
  // };

  const handleDeleteCategory = async (item: string | null) => {
    console.log("delete");
  };

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 lg:pt-5 pt-24 overflow-auto gap-5">
      <CategoryLayout
        itemId={categoryId}
        title={`Products in ${slug}`}
        linkAddItem="/add/product"
        message={message}
        loading={loading}
        isEdit={isEdit}
        isShowPopup={showPopup}
        onEdit={() => setIsEdit(!isEdit)}
        onShowPopup={() => setShowPopup(!showPopup)}
        onDeleteItem={handleDeleteCategory}
      >
        <li className="relative md:p-4 p-3 hover:shadow-lg bg-gray-50 rounded-md border border-gray-300 transition-all ease-linear duration-200">
          <Link href={`/product/test`} className="w-ful">
            <img
              src={
                "https://images.unsplash.com/photo-1554295405-abb8fd54f153?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=0"
              }
              alt="image category"
              className="w-full h-[300px] rounded-xl"
            />
          </Link>
          <p className="md:text-base text-sm font-medium text-[#1e1e1e] text-start mt-3 truncate">
            Product
          </p>
          <div className="flex items-center gap-2">
            <Fragment>
              <span className="inline-block md:text-base sm:text-sm text-xs text-[#1e1e1e] font-medium">
                $90.00
              </span>
              <span className="inline-block md:text-base sm:text-sm text-xs text-[#666] line-through">
                $100.00
              </span>
            </Fragment>

            {/* <span className="inline-block md:text-base sm:text-sm text-xs text-[#1e1e1e]">
                $100.00
              </span> */}
          </div>

          <span className="absolute top-2 right-2 text-xs font-medium py-0.5 px-2 bg-primary text-white rounded">
            25 %
          </span>

          {isEdit && (
            <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-2 lg:gap-5 gap-2">
              <button
                onClick={() => {
                  setCategoryId("1");
                  setShowPopup(true);
                }}
                className="lg:w-fit w-full text-lg text-center text-white font-medium bg-error px-5 py-1 rounded-md"
              >
                Delete
              </button>
              <Link
                href={`/edit/project/test`}
                className="lg:w-fit w-full text-lg text-center text-white font-medium bg-primary px-5 py-1 rounded-md"
              >
                Edit
              </Link>
            </div>
          )}
        </li>
      </CategoryLayout>

      {/* <ButtonShowMore loading={loadingShowMore} onClick={handleGetData} /> */}
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

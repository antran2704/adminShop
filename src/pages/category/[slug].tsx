import Link from "next/link";
import { GetServerSideProps } from "next";
import { Fragment, useState } from "react";
import ButtonShowMore from "~/components/Button/ButtonShowMore";

interface Props {
  query: any;
}

const CategoryItem = (props: Props) => {
  const { slug } = props.query;
  const [loadingShowMore, setLoadingShowMore] = useState(false);

  const handleGetData = () => {
    setLoadingShowMore(true);

    setTimeout(() => {
      setLoadingShowMore(false);
    }, 4000);
  };

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 lg:pt-5 pt-24 overflow-auto gap-5">
      <h1 className="lg:text-3xl text-2xl font-bold mb-1">
        Products in {slug}
      </h1>

      <ul className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 w-full gap-5">
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
        </li>
        <li>
          <div className="block p-5 bg-gray-50 border border-gray-300 rounded-lg transition-all ease-linear duration-200">
            <div className="skelaton w-full h-[300px] rounded-xl"></div>
            <p className="skelaton h-5 text-base font-medium text-[#1e1e1e] text-center mt-3 rounded-md"></p>
            <p className="skelaton w-1/2 h-5 text-base font-medium text-[#1e1e1e] text-center mt-3 rounded-md"></p>
          </div>
        </li>
      </ul>

      <ButtonShowMore loading={loadingShowMore} onClick={handleGetData} />
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

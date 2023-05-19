import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import ButtonShowMore from "~/components/Button/ButtonShowMore";
import { ICategory } from "./interface";

const Category = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [message, setMessage] = useState<String>("");
  const [loading, setLoading] = useState<Boolean>(true);
  const [loadingShowMore, setLoadingShowMore] = useState<Boolean>(false);

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

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <section className="scrollHidden relative flex flex-col items-start w-full h-full px-5 pb-5 lg:pt-5 pt-24 overflow-auto gap-5">
      <h1 className="lg:text-3xl text-2xl font-bold mb-1">All Categories</h1>

      <ul className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 w-full gap-5">
        {categories.length > 0 &&
          categories.map((item: ICategory) => (
            <li key={item._id}>
              <Link
                href={`/category/${item.slug}`}
                className="block p-5 hover:shadow-lg bg-gray-50 border border-gray-300 rounded-lg transition-all ease-linear duration-200"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-[300px] rounded-xl"
                />
                <p className="text-base font-medium text-[#1e1e1e] text-center mt-3 truncate">
                  {item.title}
                </p>
              </Link>
            </li>
          ))}

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

      <p className="w-full text-2xl text-center font-medium text-[#e91e63]">{message}</p>

      {categories.length > 12 && <ButtonShowMore loading={loadingShowMore} onClick={handleGetData} />}
    </section>
  );
};

export default Category;

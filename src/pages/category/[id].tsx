import Link from "next/link";
import { GetServerSideProps } from "next";
import { useState, useEffect, useCallback, Fragment } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";

import { axiosDelete, axiosGet } from "~/ultils/configAxios";
import { typeCel } from "~/enums";

import { IDataTable } from "~/interface/table";
import { IProductData } from "~/interface/product";

import Search from "~/components/Search";
import Table from "~/components/Table";
import Pagination from "~/components/Pagination";
import { deleteImageInSever } from "~/helper/handleImage";
import { productStatus } from "~/components/Table/statusCel";
import CelTable from "~/components/Table/CelTable";
import { colHeadCategory as colHeadTable } from "~/components/Table/colHeadTable";
import Popup from "~/components/Popup";

interface Props {
  query: any;
}

const initData: IDataTable = {
  _id: null,
  title: "",
  slug: "",
  thumbnail: "",
  createdAt: "",
};

const CategoryItem = (props: Props) => {
  const { id } = props.query;
  const [products, setProducts] = useState<IDataTable[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<IDataTable>(initData);

  const onSelectDeleteItem = (item: IDataTable) => {
    setSelectItem(item);
    handlePopup();
  };

  const handlePopup = useCallback(() => {
    setShowPopup(!showPopup);
  }, [products, showPopup]);

  const handleGetData = useCallback(async () => {
    setLoading(true);

    try {
      
      const response = await axiosGet(`/product/getAllProductsInCategory/${id}`);

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
        toast.error("False delete product", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      try {
        await deleteImageInSever(item.thumbnail);
        await axiosDelete(`/product/${item._id}`);
        setShowPopup(false);
        handleGetData();
        toast.success("Success delete product", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        toast.error("Error delete product", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(error);
      }
    },
    [products]
  );

  const handleSearch = async (text: string) => {
    setLoading(true);
    try {
      const response = await axiosGet(`/product/search?search=${text}`);

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setProducts([]);
          setMessage(`No product with text ${text}`);
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
        setMessage(null);
        setProducts(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage(`No product with text ${text}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <section className="lg:pt-10 px-5 pt-24">
      <div className="flex items-center justify-between gap-5">
        <h1 className="lg:text-3xl text-2xl font-bold">Products</h1>
        <Link
          href={"/add/product"}
          className="block font-medium bg-primary px-3 py-2 rounded-md"
        >
          <IoIosAdd className=" text-2xl text-white" />
        </Link>
      </div>

      <Fragment>
        <Search onSearch={handleSearch} />
        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <Fragment>
            {products.map((item: IDataTable) => (
              <tr
                key={item._id}
                className="hover:bg-slate-100 border-b border-gray-300"
              >
                <CelTable
                  type={typeCel.LINK}
                  value={item.title}
                  href={`/edit/product/${item.slug}`}
                />
                <CelTable
                  type={typeCel.THUMBNAIL}
                  value={item.thumbnail}
                  href={`/edit/product/${item.slug}`}
                />
                <CelTable
                  type={typeCel.STATUS}
                  value={"public"}
                  status={productStatus["public"]}
                />
                <CelTable type={typeCel.DATE} value={item.createdAt} />
                <CelTable
                  type={typeCel.BUTTON_LINK}
                  href={`/edit/product/${item.slug}`}
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
        {products.length > 0 && <Pagination />}
      </Fragment>

      <Popup title="Form" show={showPopup} onClose={handlePopup}>
        <div>
          <p className="text-lg">
            Do you want delete category <strong>{selectItem?.title}</strong>
          </p>
          <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-2 lg:gap-5 gap-2">
            <button
              onClick={handlePopup}
              className="lg:w-fit w-full text-lg hover:text-white font-medium bg-[#e5e5e5] hover:bg-primary px-5 py-1 rounded-md transition-cus"
            >
              Cancle
            </button>
            <button
              onClick={() => handleDeleteProduct(selectItem)}
              className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </Popup>
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

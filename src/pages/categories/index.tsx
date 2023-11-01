import Link from "next/link";
import { useState, useEffect, Fragment, useCallback, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";

import {
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";
import { typeCel } from "~/enums";

import { productStatus } from "~/components/Table/statusCel";

import { IDataCategory } from "~/interface/category";

import { deleteImageInSever } from "~/helper/handleImage";

import Search from "~/components/Search";
import Table from "~/components/Table";
import Pagination from "~/components/Pagination";
import CelTable from "~/components/Table/CelTable";
import { colHeadCategory as colHeadTable } from "~/components/Table/colHeadTable";
import Popup from "~/components/Popup";
import { IPagination } from "~/interface/pagination";

interface ISelectCategory {
  id: string;
  parent_id: string | null;
  title: string;
  thumbnail: string;
}

const initFilter = {
  search: "",
};

const initPagination: IPagination = {
  currentPage: 1,
  totalItems: 0,
  pageSize: 0,
};

// Title for tabel
const Category = () => {
  const [categories, setCategories] = useState<IDataCategory[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ISelectCategory | null>(null);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [fillter, setFiller] = useState(initFilter);
  
  const onReset = useCallback(() => {
    setFiller(initFilter);
    handleGetData();
  }, [fillter, categories]);

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const name = e.target.name;

      setFiller({ ...fillter, [name]: value });
    },
    [fillter, categories]
  );

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    setFiller({ ...fillter, [name]: value });
  };

  const onSelectDate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setFiller({ ...fillter, [name]: value });
  };

  const onChangePublish = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change publish", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await axiosPatch(`/category/${id}`, {
        public: status,
      });

      if (payload.status === 201) {
        toast.success("Success updated category", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onSelectDeleteItem = (
    id: string,
    parent_id: string | null,
    title: string,
    thumbnail: string
  ) => {
    setSelectItem({ id, parent_id, title, thumbnail });
    handlePopup();
  };

  const handlePopup = () => {
    if (showPopup) {
      console.log("close");
      setSelectItem(null);
    }

    setShowPopup(!showPopup);
  };

  const handleGetData = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet("/category/getCategories");
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setCategories([]);
          setMessage("No category");
          setLoading(false);
          return;
        }

        const data: IDataCategory[] = response.payload.map(
          (item: IDataCategory) => {
            return {
              _id: item._id,
              title: item.title,
              slug: item.slug,
              public: item.public,
              parent_id: item.parent_id,
              thumbnail: item.thumbnail,
              createdAt: item.createdAt,
            };
          }
        );
        setPagination(response.pagination);
        setCategories(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoading(false);
    }
  };

  const handleGetDataByFillter = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet(
        `/category/search?search=${fillter.search}`
      );
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setCategories([]);
          setMessage("No category");
          setLoading(false);
          return;
        }

        const data: IDataCategory[] = response.payload.map(
          (item: IDataCategory) => {
            return {
              _id: item._id,
              title: item.title,
              slug: item.slug,
              public: item.public,
              parent_id: item.parent_id,
              thumbnail: item.thumbnail,
              createdAt: item.createdAt,
            };
          }
        );
        setPagination(response.pagination);
        setCategories(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoading(false);
    }
  }, [fillter]);

  const handleDeleteCategory = useCallback(async () => {
    if (!selectItem || !selectItem.id) {
      setShowPopup(false);
      toast.error("False delete category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      await deleteImageInSever(selectItem.thumbnail);
      await axiosPost(`/category/${selectItem.id}`, {
        parent_id: selectItem.parent_id,
      });
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
  }, [selectItem]);

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <section className="py-5 px-5">
      <div className="flex items-center justify-between gap-5">
        <h1 className="lg:text-2xl text-xl font-bold">Categories</h1>

        <div className="flex items-center gap-2">
          <Link
            href={"/create/category"}
            className="flex items-center font-medium text-white bg-success px-3 py-2 rounded-md gap-1"
          >
            <IoIosAdd className=" text-2xl" />
            Create category
          </Link>
        </div>
      </div>

      <Fragment>
        <Search
          search={fillter.search}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFillter={handleGetDataByFillter}
          placeholder="Search by category name..."
        />

        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <Fragment>
            {categories.map((item: IDataCategory) => (
              <tr
                key={item._id}
                className="hover:bg-slate-100 border-b border-gray-300"
              >
                <CelTable
                  type={typeCel.LINK}
                  value={item.title}
                  href={`/edit/category/${item._id}`}
                />
                <CelTable
                  type={typeCel.THUMBNAIL}
                  value={item.thumbnail as string}
                  href={`/edit/category/${item._id}`}
                />
                <CelTable
                  id={item._id}
                  type={typeCel.PUBLIC}
                  checked={item.public}
                  status={productStatus["public"]}
                  onGetChecked={onChangePublish}
                />
                <CelTable type={typeCel.DATE} value={item.createdAt} />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/edit/category/${item._id}`}
                      className="block w-fit px-3 py-2 border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                    >
                      <AiOutlineEdit className="text-xl w-fit" />
                    </Link>

                    <button
                      onClick={() =>
                        onSelectDeleteItem(
                          item._id as string,
                          item.parent_id,
                          item.title,
                          item.thumbnail as string
                        )
                      }
                      className="block w-fit px-3 py-2 border-error border-2 text-error rounded transition duration-300 hover:bg-error hover:text-white focus:outline-none"
                    >
                      <AiOutlineDelete className="text-xl" />
                    </button>
                  </div>
                </CelTable>
              </tr>
            ))}
          </Fragment>
        </Table>
        {pagination.totalItems > pagination.pageSize && (
          <Pagination pagination={pagination} />
        )}
      </Fragment>

      {showPopup && (
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
                onClick={handleDeleteCategory}
                className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </Popup>
      )}
    </section>
  );
};

export default Category;

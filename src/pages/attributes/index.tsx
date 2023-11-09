import Link from "next/link";
import { useState, useEffect, Fragment, useCallback, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";

import { axiosDelete, axiosGet, axiosPatch } from "~/ultils/configAxios";
import { typeCel } from "~/enums";

import { IAttribute } from "~/interface";

import { deleteImageInSever } from "~/helper/handleImage";

import Search from "~/components/Search";
import Table from "~/components/Table";
import Pagination from "~/components/Pagination";
import CelTable from "~/components/Table/CelTable";
import { colHeaderAttribute as colHeadTable } from "~/components/Table/colHeadTable";
import Popup from "~/components/Popup";
import { IPagination } from "~/interface/pagination";

interface ISelectAttribute {
  id: string | null;
  title: string;
}

const initSelect: ISelectAttribute = {
  id: null,
  title: "",
};

const initFilter = {
  search: "",
};

const initPagination: IPagination = {
  currentPage: 1,
  totalItems: 0,
  pageSize: 0,
};

// Title for tabel
const AttributesPage = () => {
  const [attributes, setAttribute] = useState<IAttribute[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ISelectAttribute>(initSelect);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [fillter, setFiller] = useState(initFilter);

  const onReset = useCallback(() => {
    setFiller(initFilter);
    handleGetData();
  }, [fillter, attributes]);

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const name = e.target.name;

      setFiller({ ...fillter, [name]: value });
    },
    [fillter, attributes]
  );

  const onChangePublish = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change publish", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await axiosPatch(`/variants/${id}`, {
        public: status,
      });

      if (payload.status === 201) {
        toast.success("Success updated attribute", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const onSelectDeleteItem = (item: ISelectAttribute) => {
    setSelectItem(item);
    handlePopup();
  };

  const handlePopup = () => {
    if (showPopup) {
      console.log("close");
      setSelectItem(initSelect);
    }

    setShowPopup(!showPopup);
  };

  const handleGetData = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet("/variants");
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setAttribute([]);
          setMessage("No attribute");
          setLoading(false);
          return;
        }

        const data: IAttribute[] = response.payload.map((item: IAttribute) => {
          return {
            _id: item._id,
            name: item.name,
            code: item.code,
            public: item.public,
            createdAt: item.createdAt,
          };
        });
        setPagination(response.pagination);
        setAttribute(data);
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
        `/variants/search?search=${fillter.search}`
      );
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setAttribute([]);
          setMessage("No attribute");
          setLoading(false);
          return;
        }

        const data: IAttribute[] = response.payload.map((item: IAttribute) => {
          return {
            _id: item._id,
            name: item.name,
            code: item.code,
            public: item.public,
            createdAt: item.createdAt,
          };
        });
        setPagination(response.pagination);
        setAttribute(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error in server");
      setLoading(false);
    }
  }, [fillter]);

  const handleDeleteAttribute = useCallback(async () => {
    if (!selectItem) {
      setShowPopup(false);
      toast.error("False delete attribute", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      await axiosDelete(`/variants/${selectItem.id}`);
      setShowPopup(false);
      handleGetData();
      toast.success("Success delete attribute", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error("Error delete attribute", {
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
        <h1 className="lg:text-2xl text-xl font-bold">Attributes</h1>

        <div className="flex items-center gap-2">
          <Link
            href={"/create/category"}
            className="flex items-center font-medium text-white bg-success px-3 py-2 rounded-md gap-1"
          >
            <IoIosAdd className=" text-2xl" />
            Create attribute
          </Link>
        </div>
      </div>

      <Fragment>
        <Search
          search={fillter.search}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFillter={handleGetDataByFillter}
          placeholder="Search by attribute name..."
        />

        <Table colHeadTabel={colHeadTable} message={message} loading={loading}>
          <Fragment>
            {attributes.map((item: IAttribute) => (
              <tr
                key={item._id}
                className="hover:bg-slate-100 border-b border-gray-300"
              >
                <CelTable type={typeCel.TEXT} value={item.code} />

                <CelTable
                  type={typeCel.LINK}
                  value={item.name}
                  href={`/edit/attributes/${item._id}`}
                  className="hover:text-primary"
                />
                <CelTable
                  id={item._id as string}
                  type={typeCel.PUBLIC}
                  checked={item.public}
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
                        onSelectDeleteItem({
                          id: item._id as string,
                          title: item.name,
                        })
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
              Do you want delete attribute <strong>{selectItem?.title}</strong>
            </p>
            <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-2 lg:gap-5 gap-2">
              <button
                onClick={handlePopup}
                className="lg:w-fit w-full text-lg hover:text-white font-medium bg-[#e5e5e5] hover:bg-primary px-5 py-1 rounded-md transition-cus"
              >
                Cancle
              </button>
              <button
                onClick={handleDeleteAttribute}
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

export default AttributesPage;

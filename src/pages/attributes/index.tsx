import Link from "next/link";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect, Fragment, useCallback, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { axiosDelete, axiosGet, axiosPatch } from "~/ultils/configAxios";
import { typeCel } from "~/enums";

import { IAttribute, IFilter, IPagination } from "~/interface";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import Search from "~/components/Search";
import { Table, CelTable } from "~/components/Table";
import { colHeaderAttribute as colHeadTable } from "~/components/Table/colHeadTable";

interface ISelectAttribute {
  id: string | null;
  title: string;
}

const initSelect: ISelectAttribute = {
  id: null,
  title: "",
};

const initPagination: IPagination = {
  currentPage: 1,
  totalItems: 0,
  pageSize: 0,
};

interface Props {
  query: ParsedUrlQuery;
}

// Title for tabel
const AttributesPage = (props: Props) => {
  const { query } = props;
  const currentPage = query.page ? query.page : 1;

  const [attributes, setAttribute] = useState<IAttribute[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ISelectAttribute>(initSelect);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilter | null>(null);

  const onReset = useCallback(() => {
    setFilter(null);
    handleGetData();
  }, [filter, attributes]);

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const name = e.target.name;

      setFilter({ ...filter, [name]: value });
    },
    [filter, attributes]
  );

  const onChangePublic = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change public", {
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
      const response = await axiosGet(`/variants?page=${currentPage}`);
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

  const handleGetDataByFilter = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet(
        `/variants/search?search=${filter?.search || ""}&page=${currentPage}`
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
  }, [filter]);

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

      if (filter) {
        handleGetDataByFilter();
      } else {
        handleGetData();
      }

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
    <ShowItemsLayout
      title="Attributes"
      titleCreate="Create attribute"
      link="/create/attribute"
      selectItem={{
        title: selectItem?.title ? selectItem.title : "",
        id: selectItem?.id || null,
      }}
      pagination={pagination}
      handleDelete={handleDeleteAttribute}
      showPopup={showPopup}
      handlePopup={handlePopup}
    >
      <Fragment>
        <Search
          search={filter?.search || ""}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFilter={handleGetDataByFilter}
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
                  href={`/attributes/${item._id}`}
                  className="hover:text-primary"
                />
                <CelTable
                  id={item._id as string}
                  type={typeCel.PUBLIC}
                  checked={item.public}
                  onGetChecked={onChangePublic}
                />
                <CelTable type={typeCel.DATE} value={item.createdAt} />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/attributes/${item._id}`}
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
      </Fragment>
    </ShowItemsLayout>
  );
};

export default AttributesPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

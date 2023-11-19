import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { useState, useEffect, Fragment, useCallback, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

import { axiosDelete, axiosGet, axiosPatch } from "~/ultils/configAxios";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import { typeCel } from "~/enums";

import { IFilter, IDataCategory, IPagination } from "~/interface";

import { deleteImageInSever } from "~/helper/handleImage";

import Search from "~/components/Search";
import { Table, CelTable } from "~/components/Table";
import { colHeadCategory as colHeadTable } from "~/components/Table/colHeadTable";

interface ISelectCategory {
  id: string;
  parent_id: string | null;
  title: string;
  thumbnail: string;
}

const initPagination: IPagination = {
  currentPage: 1,
  totalItems: 0,
  pageSize: 0,
};

interface Props {
  query: ParsedUrlQuery;
}

const CategoriesPage = (props: Props) => {
  const { query } = props;
  const currentPage = query.page ? query.page : 1;

  const [categories, setCategories] = useState<IDataCategory[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ISelectCategory | null>(null);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilter | null>(null);

  const onReset = useCallback(() => {
    setFilter(null);
    handleGetData();
  }, [filter, categories]);

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const name = e.target.name;

      setFilter({ ...filter, [name]: value });
    },
    [filter, categories]
  );

  const onChangePublish = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change publish", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await axiosPatch(`/categories/${id}`, {
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
      setSelectItem(null);
    }

    setShowPopup(!showPopup);
  };

  const handleGetData = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet(`/categories?page=${currentPage}`);
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
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleGetDataByFilter = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await axiosGet(
        `/categories/search?search=${filter?.search || ""}&page=${currentPage}`
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
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  }, [filter]);

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
      await axiosDelete(`/categories/${selectItem.id}`);
      setShowPopup(false);

      if (filter) {
        handleGetDataByFilter();
      } else {
        handleGetData();
      }

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
    <ShowItemsLayout
      title="Categories"
      titleCreate="Create category"
      link="/create/category"
      selectItem={{
        title: selectItem?.title ? selectItem.title : "",
        id: selectItem?.id || null,
      }}
      pagination={pagination}
      handleDelete={handleDeleteCategory}
      showPopup={showPopup}
      handlePopup={handlePopup}
    >
      <Fragment>
        <Search
          search={filter?.search || ""}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFilter={handleGetDataByFilter}
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
                        onSelectDeleteItem(
                          item._id as string,
                          item.parent_id as string,
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
      </Fragment>
    </ShowItemsLayout>
  );
};

export default CategoriesPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

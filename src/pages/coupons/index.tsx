import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { useState, useEffect, Fragment, useCallback, ChangeEvent } from "react";
import { toast } from "react-toastify";

import { axiosDelete, axiosGet, axiosPatch } from "~/ultils/configAxios";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import { typeCel } from "~/enums";

import { IFilter, IDataCategory, IPagination } from "~/interface";

import { deleteImageInSever } from "~/helper/handleImage";

import Search from "~/components/Search";
import { Table, CelTable } from "~/components/Table";
import { colHeaderCoupon as colHeadTable } from "~/components/Table/colHeadTable";
import { ButtonDelete, ButtonEdit } from "~/components/Button";

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

const CouponsPage = (props: Props) => {
  const { query } = props;
  const currentPage = query.page ? query.page : 1;

  const [categories, setCategories] = useState<IDataCategory[]>([]);
  const [selectCategories, setSelectCategories] = useState<string[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ISelectCategory | null>(null);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilter | null>(null);

  const onSelectCheckBox = useCallback(
    (id: string) => {
      const isExit = selectCategories.find((select: string) => select === id);
      if (isExit) {
        const newSelects = selectCategories.filter(
          (select: string) => select !== id
        );
        setSelectCategories(newSelects);
      } else {
        setSelectCategories([...selectCategories, id]);
      }
    },
    [selectCategories]
  );

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
      title="Coupons"
      titleCreate="Create Coupons"
      link="/"
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
          placeholder="Search by coupon code/name..."
        />

        <Table
          //   items={categories}
          //   selects={selectCategories}
          //   setSelects={setSelectCategories}
          //   selectAll={true}
          //   isSelected={
          //     selectCategories.length === categories.length ? true : false
          //   }
          colHeadTabel={colHeadTable}
          message={message}
          loading={loading}
        >
          <Fragment>
            <tr className="hover:bg-slate-100 border-b border-gray-300">
              {/* <CelTable
                  type={typeCel.SELECT}
                  isSelected={
                    selectCategories.includes(item._id as string) ? true : false
                  }
                  onSelectCheckBox={() => onSelectCheckBox(item._id as string)}
                /> */}
              <CelTable
                type={typeCel.LINK}
                value={"Summer Gift Voucher"}
                className="whitespace-nowrap"
                href={`/edit/coupon`}
              />
              <CelTable type={typeCel.TEXT} className="whitespace-nowrap" value={"Code-123"} center={true}/>
              <CelTable type={typeCel.TEXT} value={"90%"} center={true} />
              <CelTable
                //   id={item._id as string}
                type={typeCel.PUBLIC}
                checked={true}
                onGetChecked={() => {}}
              />
              <CelTable type={typeCel.DATE} className="whitespace-nowrap" value={"Nov 27, 2023"} />
              <CelTable type={typeCel.DATE} className="whitespace-nowrap" value={"Oct 19, 2023"} />
              <CelTable
                  type={typeCel.STATUS}
                  status={"bg-success"}
                  value={"Active" }
                />
              <CelTable type={typeCel.GROUP}>
                <div className="flex items-center justify-center gap-2">
                  <ButtonEdit link={`/edit/coupon`} />

                  <ButtonDelete onClick={() => {}} />
                </div>
              </CelTable>
            </tr>
          </Fragment>
        </Table>
      </Fragment>
    </ShowItemsLayout>
  );
};

export default CouponsPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      query,
    },
  };
};

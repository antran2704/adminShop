import {
  useState,
  useEffect,
  Fragment,
  useCallback,
  ReactElement,
} from "react";
import { toast } from "react-toastify";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import { typeCel } from "~/enums";

import { IFilter, IDataCategory, IPagination } from "~/interface";

import Search from "~/components/Search";
import { Table, CelTable } from "~/components/Table";
import { colHeadCategory as colHeadTable } from "~/components/Table/colHeadTable";
import { ButtonDelete, ButtonEdit } from "~/components/Button";
import { initPagination } from "~/components/Pagination/initData";
import {
  deleteCategory,
  getCategories,
  getCategoriesWithFilter,
  updateCategory,
} from "~/api-client";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";

interface ISelectCategory {
  id: string;
  parent_id: string | null;
  title: string;
  thumbnail: string;
}

const Layout = LayoutWithHeader;
const CategoriesPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { query } = router;

  const currentPage = query.page ? Number(query.page) : 1;

  const { t, i18n } = useTranslation();

  const [categories, setCategories] = useState<IDataCategory[]>([]);
  const [selectCategories, setSelectCategories] = useState<string[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ISelectCategory | null>(null);
  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilter | null>(query.searchText ? ({ search: query.searchText } as IFilter) : null);

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

    if (!currentPage || currentPage === 1) {
      handleGetData();
    }
  }, [filter, currentPage]);

  const onChangeSearch = useCallback(
    (name: string, value: string) => {
      setFilter({ ...filter, [name]: value });
    },
    [filter]
  );

  const onChangePublish = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change publish", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await updateCategory(id, { public: status });

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

  const handleGetData = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await getCategories(currentPage);
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
      setMessage("Error in server");
      setLoading(false);
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }, [filter, currentPage]);

  const handleGetDataByFilter = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await getCategoriesWithFilter(filter, currentPage);
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
      setMessage("Error in server");
      toast.error("Error in server, please try again", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  }, [filter, currentPage]);

  const handleDeleteCategory = useCallback(async () => {
    if (!selectItem || !selectItem.id) {
      setShowPopup(false);
      toast.error("False delete category", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      await deleteCategory(selectItem.id);
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
    if (filter) {
      handleGetDataByFilter();
    } else {
      handleGetData();
    }
  }, [currentPage]);

  useEffect(() => {
    if (selectCategories.length > 0) {
      setSelectCategories([]);
    }
  }, [categories, currentPage]);

  if(!router.isReady) {
    return <Loading />
  }

  return (
    <ShowItemsLayout
      title={t("CategoriesPage.title")}
      titleCreate={t("CategoriesPage.create")}
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
          placeholder={t("CategoriesPage.search")}
        />

        <Table
          items={categories}
          selects={selectCategories}
          setSelects={setSelectCategories}
          selectAll={true}
          isSelected={
            selectCategories.length === categories.length ? true : false
          }
          colHeadTabel={colHeadTable[i18n.resolvedLanguage as string]}
          message={message}
          loading={loading}
        >
          <Fragment>
            {categories.map((item: IDataCategory) => (
              <tr
                key={item._id}
                className="hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-white border-b border-gray-300 last:border-none"
              >
                <CelTable
                  type={typeCel.SELECT}
                  isSelected={
                    selectCategories.includes(item._id as string) ? true : false
                  }
                  onSelectCheckBox={() => onSelectCheckBox(item._id as string)}
                />
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
                <CelTable
                  type={typeCel.DATE}
                  center={true}
                  value={item.createdAt}
                />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-center gap-2">
                    <ButtonEdit link={`/edit/category/${item._id}`} />

                    <ButtonDelete
                      onClick={() =>
                        onSelectDeleteItem(
                          item._id as string,
                          item.parent_id as string,
                          item.title,
                          item.thumbnail as string
                        )
                      }
                    />
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

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
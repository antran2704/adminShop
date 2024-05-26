import { useRouter } from "next/router";
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { IFilter, IPagination, ITagBlog } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import {
  deleteTagBlog,
  getTagBlogs,
  getTagBlogsWithFilter,
  updateTagBlog,
} from "~/api-client";

import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import { Table, CelTable } from "~/components/Table";
import { colHeadBlog as colHeadTable } from "~/components/Table/colHeadTable";
import { ButtonDelete, ButtonEdit } from "~/components/Button";
import { initPagination } from "~/components/Pagination/initData";
import Search from "~/components/Search";
import Loading from "~/components/Loading";

import { typeCel } from "~/enums";

const Layout = LayoutWithHeader;
const TagBlogsPage: NextPageWithLayout = () => {
  const { t, i18n } = useTranslation();

  const router = useRouter();
  const { query } = router;
  const currentPage = query.page ? Number(query.page) : 1;

  const [tagBlogs, setTagBlogs] = useState<ITagBlog[]>([]);
  const [selectBlogs, setSelectBlogs] = useState<string[]>([]);
  const [selectItem, setSelectItem] = useState<Pick<
    ITagBlog,
    "_id" | "title" | "thumbnail"
  > | null>(null);

  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilter | null>(
    query.searchText ? ({ search: query.searchText } as IFilter) : null
  );
  const [message, setMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handlePopup = () => {
    if (showPopup) {
      setSelectItem(null);
    }

    setShowPopup(!showPopup);
  };

  const onSelectCheckBox = useCallback(
    (id: string) => {
      const isExit = selectBlogs.find((select: string) => select === id);
      if (isExit) {
        const newSelects = selectBlogs.filter(
          (select: string) => select !== id
        );
        setSelectBlogs(newSelects);
      } else {
        setSelectBlogs([...selectBlogs, id]);
      }
    },
    [selectBlogs]
  );

  const onChangePublish = async (id: string, status: boolean) => {
    if (!id) {
      toast.error("False change publish", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    try {
      const payload = await updateTagBlog(id, { public: status });

      if (payload.status === 201) {
        toast.success("Success updated tag", {
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
    _id: string,
    title: string,
    thumbnail: string
  ) => {
    setSelectItem({ _id, title, thumbnail });
    handlePopup();
  };

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

  const handleGetData = useCallback(async () => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await getTagBlogs(currentPage);

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setTagBlogs([]);
          setMessage("No Tag");
          setLoading(false);
          return;
        }

        setTagBlogs(response.payload);
        setPagination(response.pagination);
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
      const response = await getTagBlogsWithFilter(filter, {}, currentPage);
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setTagBlogs([]);
          setMessage("No item");
          setLoading(false);
          return;
        }

        setPagination(response.pagination);
        setTagBlogs(response.payload);
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

  const handleDeleteBlog = useCallback(async () => {
    if (!selectItem || !selectItem._id) {
      setShowPopup(false);
      toast.error("False delete blog", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      await deleteTagBlog(selectItem._id);
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

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <ShowItemsLayout
      title={t("BlogsPage.title")}
      titleCreate={t("BlogsPage.create")}
      link="/create/tag-blog"
      selectItem={{
        title: selectItem?.title ? selectItem.title : "",
        id: selectItem?._id || null,
      }}
      pagination={pagination}
      handleDelete={handleDeleteBlog}
      showPopup={showPopup}
      handlePopup={handlePopup}
    >
      <Fragment>
        <Search
          search={filter?.search || ""}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFilter={handleGetDataByFilter}
          placeholder={t("BlogsPage.search")}
        />

        <Table
          items={tagBlogs}
          // selects={selectCategories}
          // setSelects={setSelectCategories}
          // selectAll={true}
          // isSelected={
          //   selectCategories.length === categories.length ? true : false
          // }
          colHeadTabel={colHeadTable[i18n.resolvedLanguage as string]}
          message={message}
          loading={loading}
        >
          <Fragment>
            {tagBlogs.map((item: ITagBlog) => (
              <tr
                key={item._id}
                className="hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-white border-b border-gray-300 last:border-none"
              >
                <CelTable
                  type={typeCel.SELECT}
                  isSelected={
                    selectBlogs.includes(item._id as string) ? true : false
                  }
                  onSelectCheckBox={() => onSelectCheckBox(item._id as string)}
                />
                <CelTable
                  type={typeCel.LINK}
                  value={item.title}
                  href={`/edit/tag-blog/${item._id}`}
                />
                <CelTable
                  type={typeCel.THUMBNAIL}
                  value={item.thumbnail as string}
                  href={`/edit/tag-blog/${item._id}`}
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
                  value={item.updatedAt}
                />
                <CelTable type={typeCel.GROUP}>
                  <div className="flex items-center justify-center gap-2">
                    <ButtonEdit link={`/edit/tag-blog/${item._id}`} />

                    <ButtonDelete
                      onClick={() =>
                        onSelectDeleteItem(
                          item._id as string,
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

export default TagBlogsPage;
TagBlogsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

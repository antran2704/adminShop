import dynamic from "next/dynamic";
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

import { IBlog, IFilter, IHomeBlog, IPagination } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import {
  deleteBlog,
  getBlogs,
  getBlogsWithFilter,
  updateBlog,
} from "~/api-client";

import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import { Table, CelTable } from "~/components/Table";
import { colHeadBlog as colHeadTable } from "~/components/Table/colHeadTable";
import { ButtonDelete, ButtonEdit } from "~/components/Button";
import EditorCus from "~/components/Editor";
import { initPagination } from "~/components/Pagination/initData";
import Search from "~/components/Search";
import Loading from "~/components/Loading";

import { typeCel } from "~/enums";

const CustomEditor = dynamic(
  () => {
    return import("~/components/Editor");
  },
  { ssr: false }
);

const Layout = LayoutWithHeader;
const BlogsPage: NextPageWithLayout = () => {
  const { t, i18n } = useTranslation();

  const router = useRouter();
  const { query } = router;
  const currentPage = query.page ? Number(query.page) : 1;

  const [blogs, setBlogs] = useState<IHomeBlog[]>([]);
  const [selectBlogs, setSelectBlogs] = useState<string[]>([]);
  const [selectItem, setSelectItem] = useState<Pick<
    IBlog,
    "_id" | "title" | "thumbnail"
  > | null>(null);

  const [pagination, setPagination] = useState<IPagination>(initPagination);
  const [filter, setFilter] = useState<IFilter | null>(
    query.searchText ? ({ search: query.searchText } as IFilter) : null
  );
  const [content, setContend] = useState<string>("");
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
      const payload = await updateBlog(id, { public: status });

      if (payload.status === 201) {
        toast.success("Success updated blog", {
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
      const response = await getBlogs(currentPage);

      if (response.status === 200) {
        if (response.payload.length === 0) {
          setBlogs([]);
          setMessage("No blog");
          setLoading(false);
          return;
        }

        const data: IBlog[] = response.payload.map((item: IBlog) => {
          return {
            _id: item._id,
            author: item.author,
            title: item.title,
            slug: item.slug,
            thumbnail: item.thumbnail,
            tags: item.tags,
            public: item.public,
            updatedAt: item.updatedAt,
          };
        });
        setBlogs(data);
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
      const response = await getBlogsWithFilter(filter, {}, currentPage);
      if (response.status === 200) {
        if (response.payload.length === 0) {
          setBlogs([]);
          setMessage("No category");
          setLoading(false);
          return;
        }

        const data: IHomeBlog[] = response.payload.map((item: IHomeBlog) => {
          return {
            _id: item._id,
            author: item.author,
            title: item.title,
            slug: item.slug,
            thumbnail: item.thumbnail,
            tags: item.tags,
            public: item.public,
            updatedAt: item.updatedAt,
          };
        });
        setPagination(response.pagination);
        setBlogs(data);
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

  const getContent = (newContent: string) => {
    if (!newContent) return;
    console.log(newContent);
    // setContend(newContent);
  };

  const handleDeleteBlog = useCallback(async () => {
    if (!selectItem || !selectItem._id) {
      setShowPopup(false);
      toast.error("False delete blog", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      await deleteBlog(selectItem._id);
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
    // <div className="container__cus p-5 mx-auto">
    //   <CustomEditor getContent={getContent} />
    // </div>
    <ShowItemsLayout
      title={t("BlogsPage.title")}
      titleCreate={t("BlogsPage.create")}
      link="/create/blog"
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
          items={blogs}
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
            {blogs.map((item: IHomeBlog) => (
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
                  href={`/edit/category/${item._id}`}
                />
                {/* <CelTable
                  type={typeCel.THUMBNAIL}
                  value={item.thumbnail as string}
                  href={`/edit/category/${item._id}`}
                /> */}
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
                    <ButtonEdit link={`/edit/blog/${item._id}`} />

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

export default BlogsPage;
BlogsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

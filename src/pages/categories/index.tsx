import {
  useState,
  useEffect,
  Fragment,
  useCallback,
  ReactElement,
} from "react";
import { toast } from "react-toastify";

import ShowItemsLayout from "~/layouts/ShowItemsLayout";

import {
  IFilter,
  IPagination,
  ICategoryTable,
  IResponse,
  ICategory,
  IResponseWithPagination,
  ISearch,
} from "~/interface";

import Search from "~/components/Search";
import { initPagination } from "~/components/Pagination/initData";
import {
  deleteCategory,
  getCategories,
  getCategoriesWithFilter,
  updateCategory,
} from "~/api-client";
import { NextPageWithLayout } from "~/interface/page";
import LayoutWithHeader from "~/layouts/LayoutWithHeader";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import { useTranslations } from "next-intl";
import { CategoryTable } from "~/components/CategoryPage";
import { ORDER_PARAMATER_ENUM } from "~/enums";

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

  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 10;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;

  const t = useTranslations("CategoriesPage");
  const tError = useTranslations("Error");

  const [categories, setCategories] = useState<ICategoryTable[]>([]);
  const [selectCategories, setSelectCategories] = useState<string[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const [paramater, setParamter] = useState<ISearch>({
    take: takeParam,
    page: pageParam,
    search: searchParam as string,
    order: orderParam as ORDER_PARAMATER_ENUM,
  });

  const onChangePage = (page: number, pageSize: number) => {
    setParamter({ ...paramater, page });
    router.replace({
      query: { ...router.query, page },
    });
  };

  const handleGetData = useCallback(
    async (paramater: ISearch) => {
      setMessage(null);
      setLoading(true);

      try {
        const {
          status,
          payload,
          pagination,
        }: IResponseWithPagination<ICategory[]> =
          await getCategories(paramater);
        if (status === 200) {
          const data: ICategoryTable[] = payload.map((item: ICategory) => {
            return {
              id: item._id,
              key: item._id,
              title: item.title,
              public: item.public,
              image: item.thumbnail,
              createdAt: item.createdAt,
            };
          });

          setPagination(pagination);
          setCategories(data);
        }
      } catch (error) {
        setMessage(tError("TRY_AGAIN"));
        toast.error("Error in server, please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      setLoading(false);
    },
    [paramater, categories],
  );

  useEffect(() => {
    handleGetData(paramater);
  }, [paramater]);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <ShowItemsLayout
      title={t("title")}
      titleCreate={t("create")}
      link="/create/category">
      <Fragment>
        {/* <Search
          search={filter?.search || ""}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFilter={handleGetDataByFilter}
          placeholder={t("search")}
        /> */}

        <CategoryTable
          data={categories}
          getData={() => handleGetData(paramater)}
          pagination={pagination}
          onChangePage={onChangePage}
        />

        {/* <Table
          items={categories}
          selects={selectCategories}
          setSelects={setSelectCategories}
          selectAll={true}
          isSelected={
            selectCategories.length === categories.length ? true : false
          }
          colHeadTabel={colHeadTable[router.locale as string]}
          message={message}
          loading={loading}>
          <Fragment>
            {categories.map((item: IDataCategory) => (
              <tr
                key={item._id}
                className="hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-white border-b border-gray-300 last:border-none">
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
                          item.thumbnail as string,
                        )
                      }
                    />
                  </div>
                </CelTable>
              </tr>
            ))}
          </Fragment>
        </Table> */}
      </Fragment>
    </ShowItemsLayout>
  );
};

export default CategoriesPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

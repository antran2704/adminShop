import {
  useState,
  useEffect,
  Fragment,
  useCallback,
  ReactElement,
} from "react";
import { message } from "antd";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import ShowItemsLayout from "~/layouts/ManagerLayout";

import {
  IPagination,
  ICategoryTable,
  ICategory,
  IResponseWithPagination,
  ISearch,
} from "~/interface";

import { getCategories } from "~/api-client";

import { NextPageWithLayout } from "~/interface/page";
import { ORDER_PARAMATER_ENUM } from "~/enums";

import { PrivateLayout } from "~/layouts";
import { initPagination } from "~/components/Pagination/initData";
import Loading from "~/components/Loading";
import { CategoryTable } from "~/components/CategoryPage";

const Layout = PrivateLayout;
const CategoriesPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { query } = router;

  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 10;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;

  const t = useTranslations("CategoryPage");
  const tError = useTranslations("Error");

  const [categories, setCategories] = useState<ICategoryTable[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const [paramater, setParamter] = useState<ISearch>({
    take: takeParam,
    page: pageParam,
    search: searchParam as string,
    order: orderParam as ORDER_PARAMATER_ENUM,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const onChangePage = (page: number, pageSize: number) => {
    setParamter({ ...paramater, page, take: pageSize });
    router.replace({
      query: { ...router.query, page },
    });
  };

  const handleGetData = useCallback(
    async (paramater: ISearch) => {
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
        messageApi.error(tError("TRY_AGAIN"));
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
      link="/create/category"
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
        },
      ]}>
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
          loading={loading}
          getData={() => handleGetData(paramater)}
          pagination={pagination}
          onChangePage={onChangePage}
        />

        {/* message of antd */}
        {contextHolder}
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

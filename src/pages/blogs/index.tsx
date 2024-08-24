import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useState } from "react";

import { IPagination, IResponseWithPagination, ISearch } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import { IBlog, IBlogTable } from "~/interface/blog";

import { PrivateLayout } from "~/layouts";
import ShowItemsLayout from "~/layouts/ManagerLayout";

import { initPagination } from "~/components/Pagination/initData";

import { ORDER_PARAMATER_ENUM } from "~/enums";
import { useTranslations } from "next-intl";
import { BlogTable } from "~/components/BlogPage";
import { getBlogs } from "~/api-client/blogs";

const Layout = PrivateLayout;
const BlogPage: NextPageWithLayout = () => {
  const router = useRouter();
  const t = useTranslations("BlogPage");

  const { query } = router;
  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 10;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;

  const [paramater, setParamter] = useState<ISearch>({
    take: takeParam,
    page: pageParam,
    search: searchParam as string,
    order: orderParam as ORDER_PARAMATER_ENUM,
  });

  const [blogs, setBlogs] = useState<IBlogTable[]>([]);
  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const [loading, setLoading] = useState<boolean>(false);

  const onChangePage = (page: number, pageSize: number) => {
    setParamter({ ...paramater, page, take: pageSize });
    router.replace({
      query: { ...router.query, page, take: pageSize },
    });
  };

  const handleGetData = async (query: ISearch) => {
    setLoading(true);

    await getBlogs(query).then(
      ({ payload, pagination }: IResponseWithPagination<IBlog[]>) => {
        const data: IBlogTable[] = payload.map((item: IBlog) => ({
          key: item._id,
          id: item._id,
          title: item.title,
          image: item.thumbnail,
          public: item.public,
          createdAt: item.createdAt,
        }));

        setBlogs(data);
        setPagination(pagination);
      },
    );

    setLoading(false);
  };

  useEffect(() => {
    handleGetData(paramater);
  }, [paramater]);

  return (
    <ShowItemsLayout
      title={t("title")}
      titleCreate={t("create")}
      link="/create/blog"
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
        },
      ]}>
      <Fragment>
        <BlogTable
          data={blogs}
          pagination={pagination}
          loading={loading}
          onChangePage={onChangePage}
          getData={() => handleGetData(paramater)}
        />
      </Fragment>
    </ShowItemsLayout>
  );
};

export default BlogPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

BlogPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

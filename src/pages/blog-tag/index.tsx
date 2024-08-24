import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useState } from "react";

import { IPagination, IResponseWithPagination, ISearch } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import { getTagBlogs } from "~/api-client/blogs/tagBlog";
import { IBlogTag, IBlogTagTable } from "~/interface/blog/blogTag";

import { PrivateLayout } from "~/layouts";
import ShowItemsLayout from "~/layouts/ManagerLayout";

import { initPagination } from "~/components/Pagination/initData";

import { ORDER_PARAMATER_ENUM } from "~/enums";
import { useTranslations } from "next-intl";
import { BlogTagTable } from "~/components/BlogTagPage";

const Layout = PrivateLayout;
const TagBlogsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const t = useTranslations("BlogTagPage");

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

  const [blogTags, setBlogTags] = useState<IBlogTagTable[]>([]);
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

    await getTagBlogs(query).then(
      ({ payload, pagination }: IResponseWithPagination<IBlogTag[]>) => {
        const data: IBlogTagTable[] = payload.map((item: IBlogTag) => ({
          key: item._id,
          id: item._id,
          title: item.title,
          image: item.thumbnail,
          public: item.public,
          createdAt: item.createdAt,
        }));
        setBlogTags(data);
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
      link="/create/blog-tag"
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
        },
      ]}>
      <Fragment>
        <BlogTagTable
          data={blogTags}
          pagination={pagination}
          loading={loading}
          onChangePage={onChangePage}
          getData={() => handleGetData(paramater)}
        />
      </Fragment>
    </ShowItemsLayout>
  );
};

export default TagBlogsPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

TagBlogsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

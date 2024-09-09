import { useState, useEffect, Fragment, ReactElement } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  IAttribute,
  IAttributeTable,
  IPagination,
  IResponseWithPagination,
  ISearchAttribute,
} from "~/interface";

import ShowItemsLayout from "~/layouts/ManagerLayout";

import { initPagination } from "~/components/Pagination/initData";
import { getAttributes } from "~/api-client";
import { PrivateLayout } from "~/layouts";
import { AttributeTable } from "~/components/AttributePage";
import { ORDER_PARAMATER_ENUM } from "~/enums";

const Layout = PrivateLayout;

const AttributesPage = () => {
  const router = useRouter();

  const { query } = router;

  const t = useTranslations("AttributePage");

  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 10;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;
  const publicParam = query.public ? query.public : "";

  const [paramater, setParamter] = useState<ISearchAttribute>({
    take: takeParam,
    page: pageParam,
    search: searchParam as string,
    order: orderParam as ORDER_PARAMATER_ENUM,
    public: publicParam as string,
  });

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const [attributes, setAttribute] = useState<IAttributeTable[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const onChangePage = (page: number, pageSize: number) => {
    setParamter({ ...paramater, page, take: pageSize });
    router.replace({
      query: { ...router.query, page, take: pageSize },
    });
  };

  const handleGetData = async (query: ISearchAttribute) => {
    setLoading(true);

    await getAttributes(query).then(
      ({ payload, pagination }: IResponseWithPagination<IAttribute[]>) => {
        const data: IAttributeTable[] = payload.map(
          (item: IAttribute): IAttributeTable => ({
            _id: item._id,
            key: item._id,
            code: item.code,
            title: item.name,
            public: item.public,
            createdAt: item.createdAt,
          }),
        );

        setAttribute(data);
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
      link="/create/attribute"
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
        },
      ]}>
      <Fragment>
        <AttributeTable
          data={attributes}
          loading={loading}
          getData={() => handleGetData(paramater)}
          onChangePage={onChangePage}
          pagination={pagination}
        />
        {/* <Search
          search={filter?.search || ""}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFilter={handleGetDataByFilter}
          placeholder={t("AttributesPage.search")}
        /> */}
      </Fragment>
    </ShowItemsLayout>
  );
};

export default AttributesPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

AttributesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

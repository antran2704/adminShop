import { useRouter } from "next/router";
import { useState, useEffect, Fragment, ReactElement } from "react";
import { useTranslations } from "next-intl";

import { ORDER_PARAMATER_ENUM } from "~/enums";
import { IPagination } from "~/interface/pagination";
import {
  IAttributeChild,
  IAttributeChildTable,
  IResponseWithPagination,
  ISearch,
} from "~/interface";

import { getChildAttributes } from "~/api-client";

import ShowItemsLayout from "~/layouts/ManagerLayout";
import { PrivateLayout } from "~/layouts";
import { initPagination } from "~/components/Pagination/initData";
import { AttributeChildTable } from "~/components/AttributePage";

const Layout = PrivateLayout;

const AttributeValuesPage = () => {
  const router = useRouter();

  const { query } = router;
  const { id: attributeId } = query;

  const t = useTranslations("AttributePage");

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

  const [attributes, setAttribute] = useState<IAttributeChildTable[]>([]);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const [loading, setLoading] = useState<{ getData: boolean }>({
    getData: true,
  });

  const onChangePage = (page: number, pageSize: number) => {
    setParamter({ ...paramater, page, take: pageSize });
    router.replace({
      query: { ...router.query, page, take: pageSize },
    });
  };

  const handleGetData = async (attributeId: string, query: ISearch) => {
    setLoading({ ...loading, getData: true });

    await getChildAttributes(attributeId, query).then(
      ({ payload, pagination }: IResponseWithPagination<IAttributeChild[]>) => {
        const data: IAttributeChildTable[] = payload.map(
          (item: IAttributeChild) => ({
            key: item._id,
            _id: item._id,
            public: item.public,
            title: item.name,
            createdAt: item.createdAt,
          }),
        );

        setAttribute(data);
        setPagination(pagination);
      },
    );

    setLoading({ ...loading, getData: false });
  };

  useEffect(() => {
    if (!attributeId) {
      router.push("/attributes");
      return;
    }

    handleGetData(attributeId as string, paramater);
  }, [attributeId, paramater]);

  return (
    <ShowItemsLayout
      title={t("childTitle")}
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/attributes",
        },
        {
          title: t("breadcrumb.child"),
        },
      ]}>
      <Fragment>
        <AttributeChildTable
          attributeId={attributeId as string}
          data={attributes}
          loading={loading.getData}
          getData={() => handleGetData(attributeId as string, paramater)}
          pagination={pagination}
          onChangePage={onChangePage}
        />
      </Fragment>
    </ShowItemsLayout>
  );
};

export default AttributeValuesPage;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

AttributeValuesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

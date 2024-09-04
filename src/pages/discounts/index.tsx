import { useState, useEffect, Fragment, ReactElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { message } from "antd";

import ShowItemsLayout from "~/layouts/ManagerLayout";

import { ORDER_PARAMATER_ENUM } from "~/enums";

import { IPagination, ISearch, IResponseWithPagination } from "~/interface";
import { IDiscount, IDiscountTable } from "~/interface/discount";
import { NextPageWithLayout } from "~/interface/page";

import { initPagination } from "~/components/Pagination/initData";
import Loading from "~/components/Loading";
import { PrivateLayout } from "~/layouts";

import { getDiscounts } from "~/api-client/discounts";
import { DiscountTable } from "~/components/DiscountPage";

const Layout = PrivateLayout;

const CouponsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { query } = router;

  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 10;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;

  const tBanner = useTranslations("DiscountPage");
  const tError = useTranslations("Error");

  const [discounts, setDiscounts] = useState<IDiscountTable[]>([]);
  const [paramater, setParamter] = useState<ISearch>({
    take: takeParam,
    page: pageParam,
    search: searchParam as string,
    order: orderParam as ORDER_PARAMATER_ENUM,
  });

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const [loading, setLoading] = useState<boolean>(true);

  const [messageApi, contextHolder] = message.useMessage();

  const onChangePage = (page: number, pageSize: number) => {
    setParamter({ ...paramater, page, take: pageSize });
    router.replace({
      query: { ...router.query, page, take: pageSize },
    });
  };

  const handleGetData = async (query: ISearch) => {
    setLoading(true);

    await getDiscounts(query)
      .then(({ payload, pagination }: IResponseWithPagination<IDiscount[]>) => {
        const data: IDiscountTable[] = payload.map((item: IDiscount) => ({
          key: item._id,
          id: item._id,
          name: item.discount_name,
          code: item.discount_code,
          value: item.discount_value,
          startDate: item.discount_start_date,
          endDate: item.discount_end_date,
          active: item.discount_active,
          public: item.discount_public,
          thumbnail: item.discount_thumbnail,
          type: item.discount_type,
        }));

        setPagination(pagination);
        setDiscounts(data);
      })
      .catch(() => {
        messageApi.error(tError("TRY_AGAIN"));
      });

    setLoading(false);
  };

  useEffect(() => {
    handleGetData(paramater);
  }, [paramater]);

  if (!router.isReady) {
    return <Loading />;
  }

  return (
    <ShowItemsLayout
      title={tBanner("title")}
      titleCreate={tBanner("create")}
      link="/create/discounts"
      dataBreadcrumb={[
        {
          title: tBanner("breadcrumb.list"),
        },
      ]}>
      <Fragment>
        {/* <Search
          search={filter?.search || ""}
          onReset={onReset}
          onSearch={onChangeSearch}
          onFilter={handleGetDataByFilter}
          placeholder={t("CouponsPage.search")}>
        </Search> */}

        <DiscountTable
          data={discounts}
          pagination={pagination}
          loading={loading}
          getData={() => handleGetData(paramater)}
          onChangePage={onChangePage}
        />

        {/* Context antd */}
        {contextHolder}
      </Fragment>
    </ShowItemsLayout>
  );
};

export default CouponsPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

CouponsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

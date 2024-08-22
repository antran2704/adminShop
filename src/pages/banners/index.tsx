import { useState, useEffect, Fragment, ReactElement } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { message } from "antd";

import ShowItemsLayout from "~/layouts/ManagerLayout";

import { EPermission, ERole, ORDER_PARAMATER_ENUM } from "~/enums";
import {
  IPagination,
  IBanner,
  IBannerTable,
  ISearch,
  IResponseWithPagination,
} from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import { initPagination } from "~/components/Pagination/initData";
import Loading from "~/components/Loading";
import Can from "~/components/Ability/Can";
import { BannerTable } from "~/components/BannerPage";

import LayoutWithHeader from "~/layouts/Private";

import { getBanners } from "~/api-client";

import useAbility from "~/hooks/useAbility";

const Layout = LayoutWithHeader;
const BannersPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { query } = router;

  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 10;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;

  const tBanner = useTranslations("BannerPage");
  const tError = useTranslations("Error");

  const { isCan } = useAbility([ERole.ADMIN], [EPermission.ADMIN]);

  const [banners, setBanners] = useState<IBannerTable[]>([]);
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

    try {
      const res: IResponseWithPagination<IBanner[]> = await getBanners(query);
      if (res.status === 200) {
        const data: IBannerTable[] = res.payload.map((item: IBanner) => ({
          key: item._id,
          bannerId: item._id,
          title: item.title,
          public: item.public,
          image: item.image,
          createdAt: item.createdAt,
        }));

        setPagination(res.pagination);
        setBanners(data);
      }
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
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
      titleCreate={isCan ? tBanner("create") : null}
      link="/create/banner"
      dataBreadcrumb={[
        {
          title: tBanner("breadcrumb.list"),
        },
      ]}>
      <Fragment>
        <BannerTable
          data={banners}
          pagination={pagination}
          loading={loading}
          getData={() => handleGetData(paramater)}
          onChangePage={onChangePage}
        />

        {/* Message of antd */}
        {contextHolder}
      </Fragment>
    </ShowItemsLayout>
  );
};

export default BannersPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

BannersPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

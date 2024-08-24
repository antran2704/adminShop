import { useState, useEffect, Fragment, ReactElement } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { message } from "antd";

import {
  IPagination,
  IProduct,
  IProductTable,
  IResponseWithPagination,
  ISearch,
} from "~/interface";

import ShowItemsLayout from "~/layouts/ManagerLayout";
import { initPagination } from "~/components/Pagination/initData";
import { getProducts } from "~/api-client";
import { NextPageWithLayout } from "~/interface/page";
import PrivateLayout from "~/layouts/Private";
import { EPermission, ERole, ORDER_PARAMATER_ENUM } from "~/enums";
import useAbility from "~/hooks/useAbility";
import { ProductTable } from "~/components/ProductPage";

const Layout = PrivateLayout;

const ProductPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { query } = router;

  const pageParam = query.page ? Number(query.page) : 1;
  const takeParam = query.take ? Number(query.take) : 10;
  const searchParam = query.search ? query.search : "";
  const orderParam = query.order ? query.order : ORDER_PARAMATER_ENUM.DESC;

  const t = useTranslations("ProductPage");
  const tError = useTranslations("Error");

  const { isCan } = useAbility([ERole.ADMIN], [EPermission.ADMIN]);

  const [products, setProducts] = useState<IProductTable[]>([]);
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
    setParamter({ ...paramater, page });
    router.replace({
      query: { ...router.query, page },
    });
  };

  const handleGetData = async (query: ISearch) => {
    setLoading(true);

    try {
      const res: IResponseWithPagination<IProduct[]> = await getProducts(query);
      const data: IProductTable[] = res.payload.map((item: IProduct) => ({
        key: item._id,
        productId: item._id,
        title: item.title,
        thumbnail: item.thumbnail,
        category: item.category.title,
        price: item.price,
        promotionPrice: item.promotion_price,
        public: item.public,
        inventory: item.inventory,
        createdAt: item.createdAt,
      }));

      setPagination(res.pagination);
      setProducts(data);
    } catch (error) {
      messageApi.error(tError("TRY_AGAIN"));
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetData(paramater);
  }, [paramater]);

  return (
    <ShowItemsLayout
      title={t("title")}
      titleCreate={isCan ? t("create") : null}
      link="/create/product"
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
        },
      ]}>
      <Fragment>
        <ProductTable
          data={products}
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

export default ProductPage;

export async function getStaticProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

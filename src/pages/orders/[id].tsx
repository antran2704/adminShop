import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactElement,
  useMemo,
  Fragment,
} from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { useTranslations } from "next-intl";
import { Button } from "antd";

import { IItemOrder, IOrder, IOrderDetailTable } from "~/interface/order";
import { IResponse } from "~/interface";
import { NextPageWithLayout } from "~/interface/page";

import { getOrder } from "~/api-client";

import Loading from "~/components/Loading";
import { PrivateLayout } from "~/layouts";
import {
  MainInfoOrder,
  OrderDetailTable,
  OrderProcess,
} from "~/components/OrderPage";

import { formatBigNumber } from "~/helper/format/number";
import CURRENCY from "~/common/currency";
import FormFooter from "~/components/Footer/FormFooter";
import FormLayout from "~/layouts/FormLayout";

const PDFDocument = dynamic(() => import("~/components/PDFDocument/index"), {
  loading: () => <Loading />,
  ssr: false,
});

const Layout = PrivateLayout;

const OrderDetail: NextPageWithLayout = () => {
  const t = useTranslations("OrderPage");

  const router: NextRouter = useRouter();
  const orderId = router.query.id;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [orderTable, setOrderTable] = useState<IOrderDetailTable[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [showPrint, setShowPrint] = useState<boolean>(false);

  const currency = useMemo(() => {
    return CURRENCY[router.locale as keyof typeof CURRENCY];
  }, [router.locale]);

  const onShow = (
    value: boolean,
    setValue: Dispatch<SetStateAction<boolean>>,
  ) => {
    setValue(!value);
  };

  const getData = async (id: string) => {
    setLoading(true);

    await getOrder(id)
      .then(({ payload }: IResponse<IOrder>) => {
        const dataTable: IOrderDetailTable[] = payload.items.map(
          (item: IItemOrder, index: number) => ({
            key: item._id,
            id: item.product_id,
            orderNumber: index + 1,
            productName: item.model_name,
            price: item.price,
            promotionPrice: item.promotion_price,
            thumbnail: item.image,
            quantity: item.quantity,
            total: !!item.promotion_price
              ? item.quantity * item.promotion_price
              : item.quantity * item.price,
          }),
        );

        setOrder(payload);
        setOrderTable(dataTable);

        setLoading(false);
      })
      .catch(() => {
        router.push("/404");
      });
  };

  useEffect(() => {
    if (orderId) {
      getData(orderId as string);
    }
  }, [orderId]);

  return (
    <FormLayout
      dataBreadcrumb={[
        {
          title: t("breadcrumb.list"),
          href: "/orders",
        },
        {
          title: t("breadcrumb.update"),
        },
      ]}
      borderContent={false}
      loading={!order}>
      <Fragment>
        <div className="flex items-center justify-between gap-10">
          <h1 className="md:text-xl text-lg font-medium">
            {t("detailTitle")}{" "}
            <strong className="text-primary">#{orderId}</strong>
          </h1>

          <Button
            onClick={() => onShow(showPrint, setShowPrint)}
            icon={<AiOutlinePrinter />}
            size="large"
            type="primary"
            className="flex items-center text-base text-white bg-[#0E9F6E] hover:!bg-[#0E9F6E] px-5 py-2 rounded-md gap-2">
            Print Invoice
          </Button>
        </div>

        <div className="flex items-start lg:flex-row flex-col justify-between my-10 gap-10">
          <div className="lg:w-8/12 w-full flex flex-col gap-5">
            {/* Infomation */}
            {order && (
              <MainInfoOrder
                data={order}
                getData={() => getData(orderId as string)}
              />
            )}

            {/* Table */}
            <div className="bg-[#f9fafb] border rounded-lg overflow-hidden">
              <OrderDetailTable data={orderTable} />

              {order && (
                <div className="flex items-start justify-end p-5">
                  <div className="w-1/4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="md:text-base text-sm">
                        {t("detailTable.subtotal")}
                      </h3>
                      <p className="md:text-base text-sm">
                        {formatBigNumber(
                          currency.calc(order.sub_total),
                          currency.locale,
                          { style: "currency", currency: currency.symbol },
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="md:text-base text-sm">
                        {t("detailTable.ship")}
                      </h3>
                      <p className="md:text-base text-sm">
                        {formatBigNumber(
                          currency.calc(order.shipping.shipping_fee),
                          currency.locale,
                          { style: "currency", currency: currency.symbol },
                        )}
                      </p>
                    </div>
                    {order.discount && (
                      <div className="flex items-center justify-between">
                        <h3 className="md:text-base text-sm">
                          {t("detailTable.discount")}
                        </h3>
                        <p className="md:text-base text-sm">
                          {" "}
                          -{" "}
                          {formatBigNumber(
                            currency.calc(order.discount.discount_value),
                            currency.locale,
                            { style: "currency", currency: currency.symbol },
                          )}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black">
                      <h3 className="md:text-lg text-base font-medium">
                        {t("detailTable.total")}
                      </h3>
                      <p className="md:text-lg text-base font-medium text-primary">
                        {formatBigNumber(
                          currency.calc(order.total),
                          currency.locale,
                          { style: "currency", currency: currency.symbol },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="scroll lg:w-4/12 w-full bg-[#f9fafb] max-h-[500px] p-5 border rounded-lg overflow-auto">
            {order && <OrderProcess data={order.processing_info} />}
          </div>
        </div>

        <FormFooter onCancel={() => router.push("/orders")} okElement={null} />

        {/* print pdf */}
        {showPrint && order && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999]">
            <div className="absolute w-full h-full bg-[#ffffffbf] backdrop-blur z-10"></div>
            <div
              onClick={() => onShow(showPrint, setShowPrint)}
              className="absolute w-full h-full bg-black opacity-60 z-20"></div>
            <div className="absolute w-10/12 h-screen top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 z-30">
              <PDFDocument data={order} />
            </div>
          </div>
        )}
      </Fragment>
    </FormLayout>
  );
};
export default OrderDetail;

export async function getServerSideProps(context: { locale: string }) {
  return {
    props: {
      messages: (await import(`../../../messages/${context.locale}.json`))
        .default,
    },
  };
}

OrderDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

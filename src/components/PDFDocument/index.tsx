import {
  Page,
  Text,
  View,
  Font,
  Document,
  Image,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import CURRENCY from "~/common/currency";
import { ENUM_ORDER_STATUS, ENUM_PAYMENT_METHOD } from "~/enums/order";
import { formatDate } from "~/helper/format/datetime";
import { formatBigNumber } from "~/helper/format/number";
import { getValueCoupon } from "~/helper/number/coupon";
import { ICurrency } from "~/interface";
import { IOrder, IItemOrder } from "~/interface/order";

interface Props {
  data: IOrder;
}

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 600,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: "100%",
  },
  page: {
    backgroundColor: "#ffffff",
    paddingLeft: 40,
    paddingRight: 40,
  },
  section: {
    padding: 10,
  },
  date: {
    fontSize: 10,
  },
  textCenter: {
    textAlign: "center",
  },
  textJustify: {
    textAlign: "justify",
  },
  logo: {
    width: 80,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  title: {
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: "medium",
    textTransform: "capitalize",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Roboto",
    fontWeight: "medium",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  footerTitle: {
    minWidth: "90px",
  },
  groupContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "semibold",
    textTransform: "capitalize",
    fontFamily: "Roboto",
    marginBottom: 10,
  },
  wrapContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: "2",
  },
  justifyContent_between: {
    justifyContent: "space-between",
  },
  content: {
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: "light",
  },
  table: {
    width: "100%",
    fontSize: 10,
    border: "1px solid #111111",
    borderRadius: 6,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 12,
  },
  col: {
    width: "25%",
    padding: "0 6px",
  },
  lineThrough: {
    textDecoration: "line-through",
  },
  paddingRow: {
    padding: "10px 0",
  },
  borderTop: {
    borderTop: "1px solid #111111",
  },
  consum: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

// Create Document Component
const PDFDocument = (props: Props) => {
  const { data } = props;

  const t = useTranslations("OrderPage");
  const router = useRouter();

  const currency: ICurrency = CURRENCY[router.locale as keyof typeof CURRENCY];

  return (
    <PDFViewer style={styles.viewer}>
      <Document pageLayout="singlePage" language="vi_VN">
        <Page size="A3" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.date}>
              {formatDate(new Date().toISOString())}
            </Text>
          </View>
          <View style={styles.section}>
            <Image
              style={styles.logo}
              src="https://res.cloudinary.com/neyul/image/upload/f_auto,q_auto/v1/web/master/general/uyosn9e11tw0pk3lbcij"
            />
            <Text style={styles.headerTitle}>{t("invoice")}</Text>
            <Text style={styles.sectionTitle}>{t("mainInfo.title")}</Text>

            <View style={styles.groupContent}>
              <View>
                <View style={styles.wrapContent}>
                  <Text style={styles.title}>{t("mainInfo.orderId")}: </Text>
                  <Text style={styles.content}>{data.order_id}</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>
                    {t("mainInfo.customerName")}:{" "}
                  </Text>
                  <Text style={styles.content}>
                    {data.address.shipping_name}
                  </Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>{t("mainInfo.email")}: </Text>
                  <Text style={styles.content}>
                    {data.address.shipping_email}
                  </Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>{t("mainInfo.address")}: </Text>
                  <Text style={styles.content}>
                    {data.address.shipping_address}
                  </Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>{t("mainInfo.createdAt")}: </Text>
                  <Text style={styles.content}>
                    {formatDate(data.createdAt)}
                  </Text>
                </View>
              </View>

              <View>
                <View style={styles.wrapContent}>
                  <Text style={styles.title}>{t("mainInfo.status")}: </Text>
                  <Text style={[styles.content, styles.capitalize]}>
                    {data.order_status === ENUM_ORDER_STATUS.PENDING &&
                      t("orderStatus.pending")}
                    {data.order_status === ENUM_ORDER_STATUS.PROCESS &&
                      t("orderStatus.process")}
                    {data.order_status === ENUM_ORDER_STATUS.SHIPPING &&
                      t("orderStatus.shipping")}
                    {data.order_status === ENUM_ORDER_STATUS.SUCCESS &&
                      t("orderStatus.success")}
                    {data.order_status === ENUM_ORDER_STATUS.CANCEL &&
                      t("orderStatus.cancel")}
                  </Text>
                </View>
                <View style={styles.wrapContent}>
                  <Text style={styles.title}>
                    {t("mainInfo.paymentMethod")}:{" "}
                  </Text>
                  <Text style={[styles.content, styles.capitalize]}>
                    {data.payment_method === ENUM_PAYMENT_METHOD.COD &&
                      t("paymentMethod.cod")}
                    {data.payment_method === ENUM_PAYMENT_METHOD.BANKING &&
                      t("paymentMethod.banking")}
                    {data.payment_method === ENUM_PAYMENT_METHOD.CASH &&
                      t("paymentMethod.cash")}
                    {data.payment_method === ENUM_PAYMENT_METHOD.CARD &&
                      t("paymentMethod.card")}
                    {data.payment_method === ENUM_PAYMENT_METHOD.VNPAY &&
                      t("paymentMethod.vnPay")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("mainInfo.product")}</Text>
            <View style={styles.table}>
              <View
                style={[
                  styles.row,
                  styles.paddingRow,
                  { fontFamily: "Roboto", fontWeight: "medium" },
                ]}>
                <Text style={[styles.col, styles.textCenter]}>
                  {t("detailTable.orderNumber")}
                </Text>
                <Text style={[styles.col, styles.textCenter]}>
                  {t("detailTable.product")}
                </Text>
                <Text style={[styles.col, styles.textCenter]}>
                  {t("detailTable.price")}
                </Text>
                <Text style={[styles.col, styles.textCenter]}>
                  {t("detailTable.amount")}
                </Text>
              </View>

              {data.items.map((item: IItemOrder, index: number) => (
                <View
                  key={index}
                  style={[styles.row, styles.borderTop, styles.paddingRow]}>
                  <Text style={[styles.col, styles.textCenter]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.col, styles.textCenter]}>
                    {item.model_name}
                  </Text>
                  <View style={[styles.col, styles.textCenter]}>
                    <Text>
                      {formatBigNumber(
                        !!item.promotion_price
                          ? item.promotion_price
                          : item.price,
                      )}{" "}
                      X {item.quantity}
                    </Text>

                    {!!item.promotion_price && (
                      <Text style={[styles.content, styles.lineThrough]}>
                        {item.price}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.col, styles.textCenter]}>
                    {item.promotion_price > 0
                      ? formatBigNumber(item.promotion_price * item.quantity)
                      : formatBigNumber(item.price * item.quantity)}{" "}
                    VND
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.groupContent}>
              <View />
              <View>
                <View
                  style={[styles.wrapContent, styles.justifyContent_between]}>
                  <Text style={[styles.title, styles.footerTitle]}>
                    {t("detailTable.subtotal")}:
                  </Text>
                  <Text style={styles.content}>
                    {formatBigNumber(data.sub_total)} VND
                  </Text>
                </View>
                {data.discount && (
                  <View
                    style={[styles.wrapContent, styles.justifyContent_between]}>
                    <Text style={[styles.title, styles.footerTitle]}>
                      {t("detailTable.discount")}:
                    </Text>
                    <Text style={styles.content}>
                      -{" "}
                      {formatBigNumber(
                        getValueCoupon(
                          data.sub_total,
                          data.discount.discount_value as number,
                          data.discount.discount_type as string,
                        ),
                      )}{" "}
                      VND
                    </Text>
                  </View>
                )}
                <View
                  style={[styles.wrapContent, styles.justifyContent_between]}>
                  <Text style={[styles.title, styles.footerTitle]}>
                    {t("detailTable.ship")}:
                  </Text>
                  <Text style={styles.content}>
                    {formatBigNumber(data.shipping.shipping_fee)} VND
                  </Text>
                </View>
                <View
                  style={[
                    styles.wrapContent,
                    styles.justifyContent_between,
                    styles.borderTop,
                    styles.paddingRow,
                  ]}>
                  <Text style={[styles.title, styles.footerTitle]}>
                    {t("detailTable.total")}:
                  </Text>
                  <Text style={styles.content}>
                    {formatBigNumber(data.total)} VND
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default PDFDocument;

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
import { currencyFormat } from "~/helper/currencyFormat";
import { getDateTime } from "~/helper/datetime";
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
    justifyContent: "space-between"
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
    width: "20%",
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
    justifyContent: "flex-end"
  }
});

// Create Document Component
const PDFDocument = (props: Props) => {
  const { data } = props;

  const date = new Date().toLocaleDateString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return (
    <PDFViewer style={styles.viewer}>
      <Document pageLayout="singlePage" language="vi_VN">
        <Page size="A3" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.date}>{date}</Text>
          </View>
          <View style={styles.section}>
            <Image
              style={styles.logo}
              src="https://res.cloudinary.com/neyul/image/upload/f_auto,q_auto/v1/web/master/general/uyosn9e11tw0pk3lbcij"
            />
            <Text style={styles.headerTitle}>Invoice</Text>
            <Text style={styles.sectionTitle}>Information</Text>

            <View style={styles.groupContent}>
              <View>
                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Order ID: </Text>
                  <Text style={styles.content}>{data.order_id}</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Name: </Text>
                  <Text style={styles.content}>{data.user_infor.name}</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Email: </Text>
                  <Text style={styles.content}>{data.user_infor.email}</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Address: </Text>
                  <Text style={styles.content}>{data.user_infor.address}</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Date: </Text>
                  <Text style={styles.content}>
                    {getDateTime(data.createdAt)}
                  </Text>
                </View>
              </View>

              <View>
                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Status: </Text>
                  <Text style={[styles.content, styles.capitalize]}>
                    {data.status}
                  </Text>
                </View>
                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Payment method: </Text>
                  <Text style={[styles.content, styles.capitalize]}>
                    {data.payment_method}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product</Text>
            <View style={styles.table}>
              <View
                style={[
                  styles.row,
                  styles.paddingRow,
                  { fontFamily: "Roboto", fontWeight: "medium" },
                ]}
              >
                <Text style={[styles.col, styles.textCenter]}>NO</Text>
                <Text style={[styles.col, styles.textCenter]}>Product</Text>
                <Text style={[styles.col, styles.textCenter]}>Type</Text>
                <Text style={[styles.col, styles.textCenter]}>Quantity</Text>
                <Text style={[styles.col, styles.textCenter]}>Price</Text>
                <Text style={[styles.col, styles.textCenter]}>Amount</Text>
              </View>

              {data.items.map((item: IItemOrder, index: number) => (
                <View
                  key={index}
                  style={[styles.row, styles.borderTop, styles.paddingRow]}
                >
                  <Text style={[styles.col, styles.textCenter]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.col, styles.textJustify]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.col, styles.textCenter]}>
                    {item.options.join(" / ")}
                  </Text>
                  <Text style={[styles.col, styles.textCenter]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.col, styles.textCenter]}>
                    {currencyFormat(item.price)} VND
                  </Text>
                  <Text style={[styles.col, styles.textCenter]}>
                    {currencyFormat(item.price * item.quantity)} VND
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.groupContent}>
              <View />
              <View>
                <View style={[styles.wrapContent, styles.justifyContent_between]}>
                  <Text style={[styles.title, styles.footerTitle]}>
                    Total Amount:
                  </Text>
                  <Text style={styles.content}>
                    {currencyFormat(data.sub_total)} VND
                  </Text>
                </View>
                <View style={[styles.wrapContent, styles.justifyContent_between]}>
                  <Text style={[styles.title, styles.footerTitle]}>
                    Discount:
                  </Text>
                  <Text style={styles.content}>- {currencyFormat(300)} VND</Text>
                </View>
                <View style={[styles.wrapContent, styles.justifyContent_between]}>
                  <Text style={[styles.title, styles.footerTitle]}>
                    Shipping cost:
                  </Text>
                  <Text style={styles.content}>
                    {currencyFormat(data.shipping_cost)} VND
                  </Text>
                </View>
                <View
                  style={[
                    styles.wrapContent,
                    styles.justifyContent_between,
                    styles.borderTop,
                    styles.paddingRow,
                  ]}
                >
                  <Text style={[styles.title, styles.footerTitle]}>Total:</Text>
                  <Text style={styles.content}>
                    {currencyFormat(data.total)} VND
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

import {
  Page,
  Text,
  View,
  Font,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "/fonts/Poppins-Light.ttf",
      fontWeight: 300,
    },
    {
      src: "/fonts/Poppins-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "/fonts/Poppins-Bold.ttf",
      fontWeight: 600,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  viewer: {
    width: "100%", //the pdf viewer will take up all of the width and height
    height: "100%",
  },
  page: {
    backgroundColor: "#ffffff",
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
  title: {
    fontSize: 12,
    fontFamily: "Poppins",
    fontWeight: "medium",
    textTransform: "capitalize",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins",
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
  content: {
    fontSize: 12,
    fontFamily: "Poppins",
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
});

// Create Document Component
const PDFDocument = () => {
  const date = new Date().toLocaleDateString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return (
    <PDFViewer style={styles.viewer}>
      <Document pageLayout="singlePage">
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.date}>{date}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerTitle}>Invoice</Text>
            <Text style={styles.sectionTitle}>Information</Text>

            <View style={styles.groupContent}>
              <View>
                <View style={styles.wrapContent}>
                  <Text style={styles.title}>ID invoice: </Text>
                  <Text style={styles.content}>#123</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Name: </Text>
                  <Text style={styles.content}>Antran</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Email: </Text>
                  <Text style={styles.content}>phamtrangiaan27@gmail.com</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Address: </Text>
                  <Text style={styles.content}>55 Nguyen Kiem, P3, HCM</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Name: </Text>
                  <Text style={styles.content}>Antran</Text>
                </View>

                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Date: </Text>
                  <Text style={styles.content}>29/06/2023, 21:50:24</Text>
                </View>
              </View>

              <View>
                <View style={styles.wrapContent}>
                  <Text style={styles.title}>Payment method: </Text>
                  <Text style={styles.content}>Card</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product</Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.paddingRow, {fontFamily: "Poppins", fontWeight: "medium"}]}>
                <Text style={[styles.col, styles.textCenter]}>NO</Text>
                <Text style={[styles.col, styles.textCenter]}>Product</Text>
                <Text style={[styles.col, styles.textCenter]}>Quantity</Text>
                <Text style={[styles.col, styles.textCenter]}>Price</Text>
                <Text style={[styles.col, styles.textCenter]}>Amount</Text>
              </View>

              <View style={[styles.row, styles.borderTop, styles.paddingRow]}>
                <Text style={[styles.col, styles.textCenter]}>1</Text>
                <Text style={[styles.col, styles.textJustify]}>
                  Lorem ipsum
                </Text>
                <Text style={[styles.col, styles.textCenter]}>1</Text>
                <Text style={[styles.col, styles.textCenter]}>120.000 VND</Text>
                <Text style={[styles.col, styles.textCenter]}>120.000 VND</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.groupContent}>
              <View />
              <View>
                <View style={styles.wrapContent}>
                  <Text style={[styles.title, styles.footerTitle]}>
                    Total Amount:
                  </Text>
                  <Text style={styles.content}>120.000 VND</Text>
                </View>
                <View style={styles.wrapContent}>
                  <Text style={[styles.title, styles.footerTitle]}>
                    Shipping cost:
                  </Text>
                  <Text style={styles.content}>120.000 VND</Text>
                </View>
                <View style={[styles.wrapContent, styles.borderTop, styles.paddingRow]}>
                  <Text style={[styles.title, styles.footerTitle]}>Total:</Text>
                  <Text style={styles.content}>120.000 VND</Text>
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

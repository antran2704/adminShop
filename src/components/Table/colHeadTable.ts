interface typeHeadTable {
  [k: string]: string[];
}

// header table for category - product
const colHeadCategory: string[] = [
  "Name",
  "Thumnail",
  "Publish",
  "Created Date",
  "Action",
];

// header table for orders
const colHeadOrder: typeHeadTable = {
  "vi-VN": [
    "Mã đơn",
    "Khách hàng",
    "Phương thức thanh toán",
    "Tổng tiền",
    "Trạng thái",
    "Ngày tạo",
    "Chi tiết",
  ],
  "en-US": [
    "Order ID",
    "Name",
    "Method",
    "Amout",
    "Status",
    "Created Date",
    "Action",
  ],
};

// header table for order detail
const colHeaderOrderDetail: string[] = [
  "NO",
  "Thumnail",
  "Product",
  "Options",
  "Quantity",
  "Price",
  "Promotion Price",
  "Amout",
];

// header table for attribute
const colHeaderAttribute: string[] = [
  "Code",
  "Name",
  "Published",
  "Created Date",
  "Action",
];

// header table for attribute value
const colHeaderAttributeValue: string[] = ["Name", "Published", ""];

// header table for product
const colHeaderProduct: string[] = [
  "Product Name",
  "Category",
  "Price",
  "Sale Price",
  "Inventory",
  "Status",
  "Published",
  "Action",
];

const colHeaderVariants: string[] = [
  "Image",
  "Compination",
  "SKU",
  "Barcode",
  "Price",
  "Promotion Price",
  "Inventory",
  "Action",
];

// header table for coupon
const colHeaderCoupon: string[] = [
  "Name",
  "Code",
  "Discount",
  "Published",
  "Start Date",
  "End Date",
  "Status",
  "Action",
];

const colHeaderBanner: typeHeadTable = {
  "en-US": ["Title", "Image", "Published", "Created Date", "Action"],
  "vi-VN": ["Tiêu đề", "Ảnh", "Hiện", "Ngày tạo", "Chỉnh sửa"]
};

export {
  colHeadCategory,
  colHeadOrder,
  colHeaderOrderDetail,
  colHeaderAttribute,
  colHeaderAttributeValue,
  colHeaderProduct,
  colHeaderVariants,
  colHeaderCoupon,
  colHeaderBanner,
};

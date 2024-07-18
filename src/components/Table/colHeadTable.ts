interface typeHeadTable {
  [k: string]: string[];
}

// header table for category - product
const colHeadCategory: typeHeadTable = {
  en: ["Name", "Thumnail", "Publish", "Created Date", "Action"],
  vi: ["Tên", "Ảnh", "Hiện", "Ngày tạo", "Chỉnh sửa"],
};

// header table for blog
const colHeadBlog: typeHeadTable = {
  en: ["", "Name", "Thumnail", "Publish", "Created Date", "Action"],
  vi: ["", "Tên", "Ảnh", "Hiện", "Ngày tạo", "Chỉnh sửa"],
};

// header table for tag blog
const colHeadTagBlog: typeHeadTable = {
  en: ["", "Name", "Thumnail", "Publish", "Created Date", "Action"],
  vi: ["", "Tên", "Ảnh", "Hiện", "Ngày tạo", "Chỉnh sửa"],
};

// header table for orders
const colHeadOrder: typeHeadTable = {
  vi: [
    "Mã đơn",
    "Khách hàng",
    "Phương thức thanh toán",
    "Tổng tiền",
    "Trạng thái",
    "Ngày tạo",
    "Chi tiết",
  ],
  en: [
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
const colHeaderAttribute: typeHeadTable = {
  en: ["Code", "Name", "Published", "Created Date", "Action"],
  vi: ["Mã", "Tên", "Hiện", "Ngày tạo", "Chỉnh sửa"],
};

// header table for attribute value
const colHeaderAttributeValue: typeHeadTable = {
  en: ["Name", "Published", "Action"],
  vi: ["Tên", "Hiện", "Chỉnh sửa"],
};

// header table for product
const colHeaderProduct: typeHeadTable = {
  en: [
    "Product Name",
    "Category",
    "Price",
    "Sale Price",
    "Inventory",
    "Status",
    "Published",
    "Action",
  ],
  vi: [
    "Tên",
    "Thư mục",
    "Giá",
    "Giá giảm",
    "Tồn kho",
    "Trạng thái",
    "Hiện",
    "Chỉnh sửa",
  ],
};

const colHeaderVariants: typeHeadTable = {
  en: [
    "Image",
    "Compination",
    "SKU",
    "Barcode",
    "Price",
    "Promotion Price",
    "Inventory",
    "Action",
  ],
  vi: ["Ảnh", "Tên", "SKU", "Barcode", "Giá", "Giá giảm", "Tồn kho", "Xóa"],
};

// header table for coupon
const colHeaderCoupon: typeHeadTable = {
  en: [
    "Name",
    "Code",
    "Discount",
    "Published",
    "Start Date",
    "End Date",
    "Status",
    "Action",
  ],
  vi: [
    "Tên",
    "Mã",
    "Giá trị",
    "Hiện",
    "Ngày bắt đầu",
    "Ngày kết thúc",
    "Trạng thái",
    "Chỉnh sửa",
  ],
};

const colHeaderBanner: typeHeadTable = {
  en: ["Title", "Image", "Published", "Created Date", "Action"],
  vi: ["Tiêu đề", "Ảnh", "Hiện", "Ngày tạo", "Chỉnh sửa"],
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
  colHeadBlog,
  colHeadTagBlog,
};

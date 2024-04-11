interface typeHeadTable {
  [k: string]: string[];
}

// header table for category - product
const colHeadCategory: typeHeadTable = {
  "en-US": ["Name", "Thumnail", "Publish", "Created Date", "Action"],
  "vi-VN": ["Tên", "Ảnh", "Hiện", "Ngày tạo", "Chỉnh sửa"],
};

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
const colHeaderAttribute: typeHeadTable = {
  "en-US": ["Code", "Name", "Published", "Created Date", "Action"],
  "vi-VN": ["Mã", "Tên", "Hiện", "Ngày tạo", "Chỉnh sửa"],
};

// header table for attribute value
const colHeaderAttributeValue: typeHeadTable = {
  "en-US": ["Name", "Published", "Action"],
  "vi-VN": ["Tên", "Hiện", "Chỉnh sửa"],
};

// header table for product
const colHeaderProduct: typeHeadTable = {
  "en-US": [
    "Product Name",
    "Category",
    "Price",
    "Sale Price",
    "Inventory",
    "Status",
    "Published",
    "Action",
  ],
  "vi-VN": [
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
  "en-US": [
    "Image",
    "Compination",
    "SKU",
    "Barcode",
    "Price",
    "Promotion Price",
    "Inventory",
    "Action",
  ],
  "vi-VN": [
    "Ảnh",
    "Tên",
    "SKU",
    "Barcode",
    "Giá",
    "Giá giảm",
    "Tồn kho",
    "Xóa",
  ],
};

// header table for coupon
const colHeaderCoupon: typeHeadTable = {
  "en-US": [
    "Name",
    "Code",
    "Discount",
    "Published",
    "Start Date",
    "End Date",
    "Status",
    "Action",
  ],
  "vi-VN": [
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
  "en-US": ["Title", "Image", "Published", "Created Date", "Action"],
  "vi-VN": ["Tiêu đề", "Ảnh", "Hiện", "Ngày tạo", "Chỉnh sửa"],
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

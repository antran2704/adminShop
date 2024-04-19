import { ReactNode } from "react";
import { AiOutlineSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCategoryAlt, BiDollarCircle } from "react-icons/bi";
import { MdNotificationsNone } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineUsers } from "react-icons/hi2";

export interface nameNave {
  [key: string]: string;
}

export interface itemNav {
  name: nameNave;
  path: string;
  icon?: ReactNode;
  children?: itemNav[];
}

const listBody: itemNav[] = [
  {
    name: {
      "en-US": "Dashboard",
      "vi-VN": "Trang chủ",
    },
    path: "/",
    icon: <RxDashboard />,
  },
  {
    name: {
      "en-US": "Catalog",
      "vi-VN": "Mục lục",
    },
    path: "/",
    icon: <BiCategoryAlt />,
    children: [
      {
        name: {
          "en-US": "Banners",
          "vi-VN": "Banners",
        },
        path: "/banners",
      },
      {
        name: {
          "en-US": "Categories",
          "vi-VN": "Thư mục",
        },
        path: "/categories",
      },
      {
        name: {
          "en-US": "Products",
          "vi-VN": "Sản phẩm",
        },
        path: "/products",
      },
      {
        name: {
          "en-US": "Attributes",
          "vi-VN": "Thuộc tính",
        },
        path: "/attributes",
      },
      {
        name: {
          "en-US": "Coupons",
          "vi-VN": "Mã giảm giá",
        },
        path: "/coupons",
      },
    ],
  },
  {
    name: {
      "en-US": "Order",
      "vi-VN": "Đơn hàng",
    },
    path: "/orders",
    icon: <AiOutlineShoppingCart />,
  },
  {
    name: {
      "en-US": "Income",
      "vi-VN": "Thu nhập",
    },
    path: "/",
    icon: <BiDollarCircle />,
    children: [
      {
        name: {
          "en-US": "Date",
          "vi-VN": "Trong ngày",
        },
        path: "/incomes/date",
      },
      {
        name: {
          "en-US": "Week",
          "vi-VN": "Theo tuần",
        },
        path: "/incomes/week",
      },
      {
        name: {
          "en-US": "Month",
          "vi-VN": "Theo tháng",
        },
        path: "/incomes/month",
      },
      {
        name: {
          "en-US": "Year",
          "vi-VN": "Theo năm",
        },
        path: "/incomes/year",
      },
    ],
  },
  {
    name: {
      "en-US": "Notifications",
      "vi-VN": "Thông báo",
    },
    path: "/notifications",
    icon: <MdNotificationsNone />,
  },
  {
    name: {
      "en-US": "Customers",
      "vi-VN": "Khách hàng",
    },
    path: "/customer",
    icon: <HiOutlineUsers />,
  },
];

const listSetting: itemNav[] = [
  {
    name: {
      "en-US": "Setting",
      "vi-VN": "Chỉnh sửa",
    },
    path: "/setting",
    icon: <AiOutlineSetting />,
  },
];

export { listBody, listSetting };

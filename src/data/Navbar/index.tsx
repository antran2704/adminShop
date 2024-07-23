import { ReactNode } from "react";
import { AiOutlineSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCategoryAlt, BiDollarCircle } from "react-icons/bi";
import { MdNotificationsNone } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineUsers } from "react-icons/hi2";
import { ERole } from "~/enums";

export interface nameNave {
  [key: string]: string;
}

export interface itemNav {
  name: nameNave;
  path?: string;
  icon?: ReactNode;
  children?: itemNav[];
  role: ERole[];
}

const listBody: itemNav[] = [
  {
    name: {
      en: "Dashboard",
      vi: "Trang chủ",
    },
    path: "/",
    icon: <RxDashboard />,
    role: [ERole.ADMIN, ERole.STAFF],
  },
  {
    name: {
      en: "Catalog",
      vi: "Mục lục",
    },
    icon: <BiCategoryAlt />,
    children: [
      {
        name: {
          en: "Banners",
          vi: "Banners",
        },
        path: "/banners",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Categories",
          vi: "Thư mục",
        },
        path: "/categories",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Products",
          vi: "Sản phẩm",
        },
        path: "/products",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Attributes",
          vi: "Thuộc tính",
        },
        path: "/attributes",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Coupons",
          vi: "Mã giảm giá",
        },
        path: "/coupons",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Blog",
          vi: "Blog",
        },
        path: "/blogs",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Tag Blog",
          vi: "Tag Blog",
        },
        path: "/tag-blogs",
        role: [ERole.ADMIN, ERole.STAFF],
      },
    ],
    role: [ERole.ADMIN, ERole.STAFF],
  },
  {
    name: {
      en: "Order",
      vi: "Đơn hàng",
    },
    path: "/orders",
    icon: <AiOutlineShoppingCart />,
    role: [ERole.ADMIN, ERole.STAFF],
  },
  {
    name: {
      en: "Notifications",
      vi: "Thông báo",
    },
    path: "/notifications",
    icon: <MdNotificationsNone />,
    role: [ERole.ADMIN, ERole.STAFF],
  },
  {
    name: {
      en: "Income",
      vi: "Thu nhập",
    },
    path: "/",
    icon: <BiDollarCircle />,
    children: [
      {
        name: {
          en: "Date",
          vi: "Trong ngày",
        },
        path: "/incomes/date",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Week",
          vi: "Theo tuần",
        },
        path: "/incomes/week",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Month",
          vi: "Theo tháng",
        },
        path: "/incomes/month",
        role: [ERole.ADMIN, ERole.STAFF],
      },
      {
        name: {
          en: "Year",
          vi: "Theo năm",
        },
        path: "/incomes/year",
        role: [ERole.ADMIN, ERole.STAFF],
      },
    ],
    role: [ERole.ADMIN],
  },
  {
    name: {
      en: "Customers",
      vi: "Khách hàng",
    },
    path: "/customer",
    icon: <HiOutlineUsers />,
    role: [ERole.ADMIN, ERole.STAFF],
  },
];

// const listPermisson: itemNav[] = [
//   {
//     name: {
//       "en": "Income",
//       "vi": "Thu nhập",
//     },
//     path: "/",
//     icon: <BiDollarCircle />,
//     children: [
//       {
//         name: {
//           "en": "Date",
//           "vi": "Trong ngày",
//         },
//         path: "/incomes/date",
//       },
//       {
//         name: {
//           "en": "Week",
//           "vi": "Theo tuần",
//         },
//         path: "/incomes/week",
//       },
//       {
//         name: {
//           "en": "Month",
//           "vi": "Theo tháng",
//         },
//         path: "/incomes/month",
//       },
//       {
//         name: {
//           "en": "Year",
//           "vi": "Theo năm",
//         },
//         path: "/incomes/year",
//       },
//     ],
//   },
//   {
//     name: {
//       "en": "Customers",
//       "vi": "Khách hàng",
//     },
//     path: "/customer",
//     icon: <HiOutlineUsers />,
//   },
// ];

const listSetting: itemNav[] = [
  {
    name: {
      en: "Setting",
      vi: "Chỉnh sửa",
    },
    path: "/setting",
    icon: <AiOutlineSetting />,
    role: [ERole.ADMIN, ERole.STAFF],
  },
];

export { listBody, listSetting };

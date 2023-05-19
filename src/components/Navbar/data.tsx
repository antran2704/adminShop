import { AiOutlineSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { BiLogOut, BiUser } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { ReactNode } from "react";

export interface itemNav {
  name: string;
  path: string;
  icon?: ReactNode;
  children?: itemNav[];
}

const listBody: itemNav[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: <RxDashboard />,
  },
  {
    name: "Category",
    path: "/category",
    icon: <AiOutlineShoppingCart />
  },
  {
    name: "Order",
    path: "/order",
    icon: <RxDashboard />,
  },
  {
    name: "User",
    path: "/user",
    icon: <BiUser />,
  },
  
];

const listSetting: itemNav[] = [
  {
    name: "Setting",
    path: "/setting",
    icon: <AiOutlineSetting />,
  },
  {
    name: "Logout",
    path: "/logout",
    icon: <BiLogOut />,
  },
];

export { listBody, listSetting };

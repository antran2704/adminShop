import { AiOutlineSetting } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
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
    name: "Dashboard",
    path: "/",
    icon: <RxDashboard />,
    children: [
      {
        name: "Dashboard",
        path: "/",
      },
    ],
  },
];

const listSetting: itemNav[] = [
  {
    name: "Setting",
    path: "/",
    icon: <AiOutlineSetting />,
  },
  {
    name: "Logout",
    path: "/",
    icon: <BiLogOut />,
  },
];

export { listBody, listSetting };

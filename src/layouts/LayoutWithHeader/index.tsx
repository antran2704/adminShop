import { useState, Fragment } from "react";

import SideBar from "~/components/SideBar";
import Navbar from "~/components/Navbar";
import DefaultLayout from "../DefaultLayout";

interface Props {
  children: JSX.Element;
}

const LayoutWithHeader = ({ children }: Props) => {
  const [showSidebar, setShowSideBar] = useState<boolean>(false);

  return (
    <DefaultLayout>
      <Fragment>
        <SideBar showSideBar={showSidebar} setShowSideBar={setShowSideBar} />
        <div className="w-full min-h-screen">
          <Navbar showSideBar={showSidebar} setShowSideBar={setShowSideBar} />
          {children}
        </div>
      </Fragment>
    </DefaultLayout>
  );
};

export default LayoutWithHeader;

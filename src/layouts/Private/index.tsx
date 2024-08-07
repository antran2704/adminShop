import { useState, Fragment, useEffect } from "react";

import SideBar from "~/components/SideBar";
import Navbar from "~/components/Navbar";
import DefaultLayout from "../DefaultLayout";
import useViewport from "~/hooks/useViewport";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import clsx from "clsx";
import { changeShowSideBar } from "~/store/slice/setting";

interface Props {
  children: JSX.Element;
}

const PrivateLayout = ({ children }: Props) => {
  const router = useRouter();
  const width = useViewport();

  const dispatch = useAppDispatch();
  const { isShowSidebar } = useAppSelector((state) => state.setting);

  const [showSidebar, setShowSideBar] = useState<boolean>(false);

  const onShowModal = () => {
    setShowSideBar(!showSidebar);
    dispatch(changeShowSideBar(!showSidebar));
  };

  useEffect(() => {
    if (width < 1280) {
      setShowSideBar(false);
    }
  }, [router.asPath]);

  return (
    <DefaultLayout>
      <Fragment>
        <SideBar showSideBar={showSidebar} onShowModal={onShowModal} />
        <div
          className={clsx(
            "min-h-screen transition-all ease-linear duration-150",
            [isShowSidebar ? "xl:w-[80%] w-full" : "w-full "],
          )}>
          <Navbar onShowModal={onShowModal} />
          {children}
        </div>
      </Fragment>
    </DefaultLayout>
  );
};

export default PrivateLayout;

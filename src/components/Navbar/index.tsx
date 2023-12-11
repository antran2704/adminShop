import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { FC, useState, useEffect } from "react";
import { RiListSettingsFill } from "react-icons/ri";
import { BsArrowLeft } from "react-icons/bs";
import { listBody, listSetting, itemNav } from "./data";
import useViewport from "~/hooks/useViewport";
import { useAppSelector } from "~/store/hooks";
import ImageCus from "../Image/ImageCus";
import NavbarItem from "./NavbarItem";

// const NavbarItem = dynamic(() => import("./NavbarItem"), {
//   ssr: true,
// });
const Navbar: FC = () => {
  const router = useRouter();
  const width = useViewport();
  const { infor } = useAppSelector((state) => state.user);

  const [show, setShow] = useState(false);

  const handeShow = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (width < 1280) {
      setShow(false);
    }
  }, [router.asPath]);

  return (
    <>
      <button
        className="fixed flex items-center justify-center w-10 h-10 right-2 bottom-2 bg-black rounded-md opacity-60 hover:opacity-100 z-10"
        onClick={handeShow}
      >
        <RiListSettingsFill className="text-xl text-white" />
      </button>
      {/* Navbar on PC */}
      <nav
        className={`xl:sticky fixed top-0 xl:left-0 ${
          show
            ? "xl:w-4/12 lg:w-5/12 md:w-6/12 sm:w-8/12 w-10/12 lg:px-5 pl-5 py-5 pb-10 lg:mr-5"
            : "w-0 mx-0 px-0 invisible"
        } h-screen bg-white rounded-tr-xl rounded-br-xl shadow-xl overflow-hidden transition-all ease-linear duration-200 z-[1000]`}
      >
        <button className="mb-5" onClick={handeShow}>
          <BsArrowLeft className="text-3xl" />
        </button>

        {infor?._id && (
          <div className="h-20 flex items-center gap-3">
            <ImageCus
              src={infor.avartar as string}
              className="w-[60px] h-[60px] object-cover border rounded-full"
              title="avartar"
            />
            <h2 className="text-black text-xl font-medium">{infor.name}</h2>
          </div>
        )}
        <div className="h-[60%] py-3 overflow-hidden">
          <h3 className="text-black text-lg font-medium mb-3">Menu</h3>
          <ul className="scroll h-full pb-7 overflow-auto">
            {listBody.map((item: itemNav, index: number) => (
              <NavbarItem
                key={index}
                subNav={item?.children ? true : false}
                data={item}
              />
            ))}
          </ul>
        </div>
        <div className="h-[30%] py-3 overflow-hidden">
          <h3 className="text-black text-lg font-medium mb-3">Setting</h3>
          <ul className="scroll h-full pb-7 overflow-auto">
            {listSetting.map((item: itemNav, index: number) => (
              <NavbarItem
                key={index}
                subNav={item?.children ? true : false}
                data={item}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* Navbar on Tablet && Mobile */}
      <div
        onClick={handeShow}
        className={`xl:hidden fixed top-0 left-0 right-0 bottom-0 bg-black ${
          show
            ? "opacity-60 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-all ease-linear duration-200 z-50`}
      ></div>
    </>
  );
};

export default Navbar;

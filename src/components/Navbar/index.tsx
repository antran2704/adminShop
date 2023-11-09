import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { FC, useState, useEffect } from "react";
import { RiListSettingsFill } from "react-icons/ri";
import { BsArrowLeft } from "react-icons/bs";
import { listBody, listSetting, itemNav } from "./data";
import useViewport from "~/hooks/useViewport";
const NavbarItem = dynamic(() => import("./NavbarItem"), {
  ssr: false,
});

const Navbar: FC = () => {
  const router = useRouter();
  const width = useViewport();
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
            ? "xl:w-3/12 md:w-4/12 w-6/12 lg:px-5 pl-5 py-5 pb-10 lg:mr-5"
            : "w-0 mx-0 px-0 invisible"
        } h-screen bg-white rounded-tr-xl rounded-br-xl shadow-xl overflow-hidden transition-all ease-linear duration-300 z-[1000]`}
      >
        <button className="mb-5" onClick={handeShow}>
          <BsArrowLeft className="text-3xl" />
        </button>

        <div className="h-20 flex items-center gap-3">
          <img
            src="https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-1/339008852_924551378682494_5390565819522752388_n.jpg?stp=dst-jpg_p100x100&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=kBy7yusXoccAX9A1PZM&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfCpsY3N3Ra1Bqoni8C_6auUpH4qB2bnpDv4YEOF96Mq8Q&oe=64642926"
            alt="avatar"
            className="w-[60px] h-[60px] border rounded-full"
          />
          <h2 className="text-black text-xl font-medium">Antran</h2>
        </div>
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
        } transition-all ease-linear duration-200 z-10`}
      ></div>
      {/* <div
        style={{ backgroundColor: "rgba(37, 40, 54, 0.8)" }}
        className="fixed xl:hidden block max-h-[70px] top-0 left-0 right-0 p-5 backdrop-blur z-10"
      >
        <HiBars3BottomRight
          onClick={handeShow}
          className="text-3xl text-white ml-auto cursor-pointer"
        />
      </div> */}
    </>
  );
};

export default Navbar;

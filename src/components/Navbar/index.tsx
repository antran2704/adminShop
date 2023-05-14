import Link from "next/link";
import { FC, useState } from "react";
import NavbarItem from "./NavbarItem";
import { listBody, listSetting, itemNav } from "./data";

const Navbar: FC = () => {
  const [show, setShow] = useState(false);

  const handeShow = () => {
    setShow(!show);
  };

  return (
    <>
      {/* Navbar on PC */}
      <nav className="relative lg:block hidden w-3/12 h-screen bg-white px-5 py-10 rounded-t-xl rounded-b-xl shadow-xl overflow-hidden z-10">
        <div className="h-20 flex items-center gap-3">
          <img
            src="https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-1/339008852_924551378682494_5390565819522752388_n.jpg?stp=dst-jpg_p100x100&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=kBy7yusXoccAX9A1PZM&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfCpsY3N3Ra1Bqoni8C_6auUpH4qB2bnpDv4YEOF96Mq8Q&oe=64642926"
            alt="avatar"
            className="w-[60px] h-[60px] border rounded-full"
          />
          <h2 className="text-xl font-medium">Antran</h2>
        </div>
        <div className="h-[60%] py-3 overflow-hidden">
          <h3 className="text-lg font-medium mb-3">Menu</h3>
          <ul className="scrollHidden h-full pb-7 overflow-auto">
            {listBody.map((item: itemNav, index: number) => (
              <NavbarItem
                key={index}
                subNav={item?.children ? true : false}
                data={item}
              />
            ))}
          </ul>
        </div>
        <div className="h-[20%] py-3">
          <h3 className="text-lg font-medium mb-3">Setting</h3>
          <ul className="h-full">
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
        className={`${
          show ? "block" : "hidden"
        } lg:hidden fixed top-0 left-0 right-0 bottom-0 bg-transparent z-10`}
      ></div>
      <nav
        className={`lg:hidden hidden fixed top-0 bottom-0 left-0 w-fit h-screen bg-white px-5 py-10 rounded-tr-xl rounded-br-xl shadow-xl overflow-hidden transition-all ease-linear duration-200 z-20`}
      >
        <div
          onClick={handeShow}
          className={`${
            show ? "hidden" : "block"
          } absolute top-0 left-0 right-0 bottom-0 bg-transparent z-10`}
        ></div>
        <div className="flex items-center gap-3">
          <img
            src="https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-1/339008852_924551378682494_5390565819522752388_n.jpg?stp=dst-jpg_p100x100&_nc_cat=105&ccb=1-7&_nc_sid=7206a8&_nc_ohc=kBy7yusXoccAX9A1PZM&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfCpsY3N3Ra1Bqoni8C_6auUpH4qB2bnpDv4YEOF96Mq8Q&oe=64642926"
            alt="avatar"
            className="w-[50px] h-[50px] border rounded-full"
          />
          <h2 className={`${show ? "block" : "hidden"} text-lg font-medium`}>
            Antran
          </h2>
        </div>
        <div className="h-[60%] py-3 overflow-hidden">
          <h3
            className={`${
              show ? "text-start" : "text-center"
            } text-base font-medium mb-3`}
          >
            Menu
          </h3>
          <ul
            className={`scrollHidden flex flex-col ${
              show ? "item-start" : "items-center"
            } h-full pb-7 overflow-auto`}
          >
            {listBody.map((item: itemNav, index: number) => (
              <NavbarItem
                key={index}
                subNav={item?.children ? true : false}
                show={show}
                data={item}
              />
            ))}
          </ul>
        </div>
        <div className="h-[20%] py-3">
          <h3
            className={`${
              show ? "text-start" : "text-center"
            } text-base font-medium mb-3`}
          >
            Setting
          </h3>
          <ul
            className={`scrollHidden flex flex-col ${
              show ? "item-start" : "items-center"
            } h-full pb-7 overflow-auto`}
          >
            {listSetting.map((item: itemNav, index: number) => (
              <NavbarItem
                key={index}
                show={show}
                subNav={item?.children ? true : false}
                data={item}
              />
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

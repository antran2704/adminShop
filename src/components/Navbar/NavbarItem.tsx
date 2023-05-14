import Link from "next/link";
import { FC, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { itemNav } from "./data";

interface Props {
  subNav: boolean;
  show?: boolean;
  data: itemNav;
}

const NavbarItem: FC<Props> = (props: Props) => {
  const { subNav, show, data } = props;

  const elRef = useRef<HTMLUListElement>(null);

  const handleCollapse = (): void => {
    const el = elRef.current;
    if (el) {
      const currentHeight = el.clientHeight;

      if (currentHeight === 0) {
        el.style.height = el.scrollHeight + "px";
      } else {
        el.style.height = "0px";
      }
    }
  };

  return (
    <>
      {!subNav && (
        <li className="w-full">
          <Link
            className="w-full flex items-center text-lg font-medium px-3 py-2 hover:bg-[#418efd] hover:text-white rounded-lg transition-all ease-linear duration-100 gap-3"
            href={data.path}
          >
            <span className={`min-w-10 lg:mx-0 ${show ? "mx-0" : "mx-auto"}`}>
              {data.icon}
            </span>
            <span className={`${show ? "block" : "hidden"} lg:block`}>
              {data.name}
            </span>
          </Link>
        </li>
      )}

      {subNav && (
        <li className={`w-full`}>
          <div
            onClick={handleCollapse}
            className="w-full flex items-center justify-center px-3 py-2 hover:bg-[#418efd] hover:text-white rounded-lg transition-all ease-linear duration-200 gap-5 cursor-pointer"
          >
            <div className="w-full flex items-center text-lg font-medium gap-3">
              <span className={`min-w-10 lg:mx-0 ${show ? "mx-0" : "mx-auto"}`}>
                {data.icon}
              </span>
              <span className={`lg:block ${show ? "block" : "hidden"}`}>
                {data.name}
              </span>
            </div>
            <MdAdd
              className={`lg:text-2xl text-xl lg:block ${
                show ? "block" : "hidden"
              }`}
            />
          </div>

          <ul
            ref={elRef}
            className={`${
              show ? "w-auto" : "w-0"
            } lg:w-full h-0 pl-5 transition-all ease-linear duration-300 overflow-hidden`}
          >
            {data.children?.map((item: itemNav, index: number) => (
              <li key={index} className="w-full">
                <Link
                  className="w-full flex items-center text-base font-medium px-3 py-2 hover:bg-[#418efd] hover:text-white rounded-lg transition-all ease-linear duration-100 gap-3"
                  href={item.path}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      )}
    </>
  );
};

export default NavbarItem;

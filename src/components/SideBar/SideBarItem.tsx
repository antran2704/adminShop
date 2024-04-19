import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useRef, useState, memo } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { itemNav } from "../../data/Navbar";
import { useTranslation } from "react-i18next";

interface Props {
  subNav: boolean;
  data: itemNav;
}

const NavbarItem: FC<Props> = (props: Props) => {
  const { subNav, data } = props;
  const router = useRouter();
  const [show, setShow] = useState(false);
  const elRef = useRef<HTMLUListElement>(null);

  const { i18n } = useTranslation();

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
    setShow(!show);
  };

  return (
    <>
      {!subNav && (
        <li className="w-full mb-1">
          <Link
            className={`w-full flex items-center text-lg font-medium px-3 py-2 ${
              router.pathname === data.path
                ? "bg-primary text-white"
                : "hover:bg-primary text-black dark:text-darkText hover:text-white"
            } lg:rounded-lg rounded-tl-lg rounded-bl-lg gap-3`}
            href={data.path}
          >
            <span>{data.icon}</span>
            <span className="whitespace-nowrap">{data.name[i18n.resolvedLanguage as string]}</span>
          </Link>
        </li>
      )}

      {subNav && (
        <li className={`w-full mb-1`}>
          <div
            onClick={handleCollapse}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-primary hover:text-white lg:rounded-lg rounded-tl-lg rounded-bl-lg transition-all ease-linear duration-200 cursor-pointer"
          >
            <div className="w-full flex items-center text-lg dark:text-darkText font-medium gap-3">
              <span>{data.icon}</span>
              <span className="whitespace-nowrap">{data.name[i18n.resolvedLanguage as string]}</span>
            </div>
            {!show && (
              <AiOutlinePlus
                className={`lg:text-2xl text-xl lg:block dark:text-darkText`}
              />
            )}
            {show && (
              <AiOutlineMinus
                className={`lg:text-2xl text-xl lg:block dark:text-darkText`}
              />
            )}
          </div>

          <ul
            ref={elRef}
            className={`lg:w-full h-0 pl-5 transition-all ease-linear duration-300 overflow-hidden`}
          >
            {data.children?.map((item: itemNav, index: number) => (
              <li key={index} className="w-full">
                <Link
                  className={`w-full flex items-center text-base font-medium px-3 py-2 my-1 ${
                    router.asPath.includes(item.path)
                      ? "bg-primary text-white"
                      : "hover:bg-primary text-black dark:text-darkText hover:text-white"
                  } lg:rounded-lg rounded-tl-lg rounded-bl-lg gap-3`}
                  href={item.path}
                >
                  {item?.icon && <span>{item.icon}</span>}
                  <span className="whitespace-nowrap">{item.name[i18n.resolvedLanguage as string]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      )}
    </>
  );
};

export default memo(NavbarItem);

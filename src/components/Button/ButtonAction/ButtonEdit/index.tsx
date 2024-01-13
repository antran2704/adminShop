import Link from "next/link";
import { memo, Fragment } from "react";
import { FaRegEdit } from "react-icons/fa";

interface Props {
  link?: string;
  target?: "_blank" | "_self";
  className?: string;
  onClick?: () => void;
}

const ButtonEdit = (props: Props) => {
  const { link, className, target = "_self", onClick } = props;

  return (
    <Fragment>
      {link && (
        <Link
          href={link}
          target={target}
          className={`${
            className ? className : ""
          } block w-fit px-3 py-2 text-[#9ca3af] rounded transition duration-300 hover:text-success`}
        >
          <FaRegEdit className="text-xl" />
        </Link>
      )}

      {!link && (
        <button
          onClick={onClick}
          className={`${
            className ? className : ""
          } block w-fit px-3 py-2 text-[#9ca3af] rounded transition duration-300 hover:text-success`}
        >
          <FaRegEdit className="text-xl" />
        </button>
      )}
    </Fragment>
  );
};

export default memo(ButtonEdit);

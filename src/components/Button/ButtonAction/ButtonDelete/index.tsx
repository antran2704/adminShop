import { memo } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

interface Props {
  className?: string;
  onClick: () => void;
}

const ButtonDelete = (props: Props) => {
  const { className, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={`${
        className ? className : ""
      } block w-fit px-3 py-2 text-[#9ca3af] dark:text-white rounded transition duration-300 hover:text-error dark:hover:text-error`}
    >
      <RiDeleteBin6Line className="text-xl" />
    </button>
  );
};

export default memo(ButtonDelete);

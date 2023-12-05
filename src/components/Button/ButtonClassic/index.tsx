import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {
  title: string;
  size: "L" | "M" | "S";
  className?: string;
  loading?: boolean;
  disable?: boolean;
  handleClick?: () => void;
}

const ButtonClassic = (props: Props) => {
  const {
    title,
    loading = false,
    size = "M",
    disable = false,
    className,
    handleClick,
  } = props;

  const SIZE = {
    L: "text-lg px-5 py-3",
    M: "text-base px-5 py-2",
    S: "text-sm px-5 py-2",
  };

  const onClick = () => {
    if (!handleClick) return;

    handleClick();
  };

  return (
    <button
      className={`${className ? className : ""} ${SIZE[size]} ${
        disable ? "pointer-events-none" : ""
      } text-white rounded-md opacity-80 hover:opacity-100`}
      onClick={onClick}
    >
      {!loading ? (
        title
      ) : (
        <AiOutlineLoading3Quarters className="spinner text-xl text-white" />
      )}
    </button>
  );
};

export default ButtonClassic;

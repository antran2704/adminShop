import { memo } from "react";
import { typeButton } from "~/enums";

interface Props {
  type: typeButton;
  title: string;
  className?: string;
  disable?: boolean;
  onClick?(): void;
}

const Button = (props: Props) => {
  const { title, type, className, onClick } = props;
  const style = {
    large: "",
    medium:
      "sm:text-base text-sm capitalize font-medium px-5 py-1 rounded-md transition-cus",
    small: "w-fit font-medium text-xs capitalize px-5 py-2 rounded-md",
  };

  return (
    <button
      onClick={onClick}
      className={`${style[type]} ${className} ${
        props.disable ? "opacity-80 pointer-events-none" : "opacity-100"
      }`}
    >
      {title}
    </button>
  );
};

export default memo(Button);

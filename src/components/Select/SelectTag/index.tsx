import { memo } from "react";

interface Props {
  title: string;
  value: string;
  currentSelect: string;
  className?: string;
  size: "L" | "M" | "S";
  onSelect: (value: string) => void;
}

const SIZE = {
  L: "text-lg",
  M: "text-base",
  S: "text-sm",
};

const SelectTag = (props: Props) => {
  const {
    title,
    className,
    size = "M",
    value,
    currentSelect,
    onSelect,
  } = props;

  return (
    <button
      onClick={() => onSelect(value)}
      className={`${SIZE[size]} ${className ? className : ""} ${
        value === currentSelect ? "text-success dark:text-success border-success" : ""
      } dark:text-darkText font-medium px-4 py-1 border-2 rounded-lg`}
    >
      {title}
    </button>
  );
};

export default memo(SelectTag);

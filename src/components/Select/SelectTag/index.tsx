interface Props {
  title: string;
  value: string;
  currentSelect: string;
  className?: string;
  size: "L" | "M" | "S";
  onSelect: () => void;
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
      onClick={onSelect}
      className={`${SIZE[size]} ${className ? className : ""} ${
        value === currentSelect ? "text-success border-success" : ""
      }  font-medium px-4 py-1 border-2 rounded-lg`}
    >
      {title}
    </button>
  );
};

export default SelectTag;

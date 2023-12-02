interface Props {
  title: string;
  size: "L" | "M" | "S";
  className?: string;
  disable?: boolean;
  handleClick?: () => void;
}

const ButtonClassic = (props: Props) => {
  const { title, size = "M", disable = false, className, handleClick } = props;

  const SIZE = {
    L: "text-lg",
    M: "text-base",
    S: "text-sm",
  };

  const onClick = () => {
    if (!handleClick) return;

    handleClick();
  };

  return (
    <button
      className={`${className ? className : ""} ${
        SIZE[size]
      } ${disable ? 'pointer-events-none' : ""} px-5 py-2 text-white rounded-md opacity-80 hover:opacity-100`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default ButtonClassic;

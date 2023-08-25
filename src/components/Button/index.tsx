import { typeButton } from "~/enums";

interface Props {
  type: typeButton;
  title: string;
  className?: string;
  onClick?(): void;
}

const Button = (props: Props) => {
  const { title, type, className, onClick } = props;

  const style = {
    large: "",
    medium:
      "text-base capitalize font-medium px-5 py-1 rounded-md transition-cus",
    small:
      "w-fit font-medium text-xs capitalize px-5 py-2 rounded-md",
  };

  return (
    <button onClick={onClick} className={`${style[type]} ${className}`}>
      {title}
    </button>
  );
};

export default Button;

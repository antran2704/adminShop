import { ChangeEvent, FC, memo } from "react";

interface Props {
  title?: string;
  className?: string;
  name: string;
  value: string;
  type: "date" | "datetime-local";
  error?: boolean;
  message?: string | null;
  onSelect: (name: string, value: string) => void;
}

const SelectDate: FC<Props> = (props: Props) => {
  const {
    className,
    title,
    name,
    type = "date",
    value,
    message,
    error,
    onSelect,
  } = props;

  const onSelectDate = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    onSelect(value, name);
  };

  return (
    <div className={`${className ? className : "w-full"} h-full`}>
      {title && (
        <span className="block text-base text-[#1E1E1E] dark:text-darkText font-medium mb-1">
          {title}
        </span>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onSelectDate}
        className={`w-full min-h-[40px] ${
          error && "border-error"
        } dark:bg-darkInput dark:text-white px-2 py-1 border-2 focus:border-[#4f46e5] dark:border-transparent rounded-md outline-none`}
      />
      {message && <p className="text-base text-error">{message}</p>}
    </div>
  );
};

export default memo(SelectDate);

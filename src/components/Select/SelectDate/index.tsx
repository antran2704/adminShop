import { ChangeEvent, FC } from "react";

interface Props {
  title?: string;
  className?: string;
  name: string;
  value: string;
  error?: boolean;
  onSelect: (name: string, value: string) => void;
}

const SelectDate: FC<Props> = (props: Props) => {
  const { className, title, name, value, error, onSelect } = props;

  const onSelectDate = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    onSelect(name, value);
  };

  return (
    <div className={`${className ? className : "w-full"} h-full`}>
      {title && (
        <span className="block text-base text-[#1E1E1E] font-medium mb-1">
          {title}
        </span>
      )}

      <input
        type="datetime-local"
        name={name}
        value={value}
        onChange={onSelectDate}
        className={`w-full min-h-[40px] ${
          error && "border-error"
        } rounded-md px-2 py-1 border-2 focus:border-[#4f46e5]`}
      />
    </div>
  );
};

export default SelectDate;

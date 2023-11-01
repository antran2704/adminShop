import { ChangeEvent, FC } from "react";

interface Props {
  title?: string;
  width?: string;
  name: string;
  onSelect: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SelectDate: FC<Props> = (props: Props) => {
  const { width, title, name, onSelect } = props;
  return (
    <div className={`${width ? width : "w-full"} h-full`}>
      {title && (
        <span className="block text-base text-[#1E1E1E] font-medium mb-1">
          {title}
        </span>
      )}

      <input
        type="date"
        name={name}
        onChange={onSelect}
        className="w-full min-h-[40px] rounded-md px-2 py-1 border-2 focus:border-[#4f46e5]"
      />
    </div>
  );
};

export default SelectDate;

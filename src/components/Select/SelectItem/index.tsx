import { FC, memo, ChangeEvent } from "react";
import { ISelectItem } from "~/interface";

interface Props {
  title?: string;
  width?: string;
  name: string;
  placeholder?: string;
  value: string;
  data: ISelectItem[];
  onSelect: (value: string, name: string) => void;
}

const SelectItem: FC<Props> = (props: Props) => {
  const { width, title, data, placeholder, value, name, onSelect } = props;

  const onSelectItem = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    onSelect(value, name);
  }

  return (
    <div className={`${width ? width : "w-full"} h-full`}>
      {title && (
        <span className="block text-base text-[#1E1E1E] dark:text-darkText font-medium mb-1">
          {title}
        </span>
      )}
      
      <select
        value={value}
        name={name}
        onChange={onSelectItem}
        className="w-full min-h-[40px] rounded-md px-2 py-1 border-2 focus:border-[#4f46e5]"
      >
        {placeholder && (
          <option value="All" hidden>
            {placeholder}
          </option>
        )}

        {data.length > 0 &&
          data.map((item: ISelectItem) => (
            <option className="capitalize" key={item._id} value={item._id as string}>
              {item.title}
            </option>
          ))}
      </select>
    </div>
  );
};

export default memo(SelectItem);

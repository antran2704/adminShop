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
        <span className="block text-base text-[#1E1E1E] font-medium mb-1">
          {title}
        </span>
      )}
      {/* layout to close list select item */}
      {/* <div
        onClick={() => setShow(!show)}
        className={`fixed ${
          show ? "block" : "hidden"
        } top-0 left-0 bottom-0 right-0 bg-transparent z-10`}
      ></div>
      <div
        className={`relative flex items-center w-full h-9 rounded-md px-2 py-1 ${
          show && "border-[#4f46e5]"
        } border-2 outline-none cursor-pointer`}
      >
        <div
          onClick={() => setShow(!show)}
          className="flex items-center w-full justify-between"
        >
          <p className="flex-1 text-base">{props.data.title}</p>
          <FiChevronDown className="ml-auto text-lg" />
        </div>

       
        <ul
          className={`absolute ${
            show
              ? "top-9 opacity-100 pointer-events-auto"
              : "top-11 opacity-0 pointer-events-none"
          } left-0 w-full bg-white border-2 rounded-md overflow-hidden shadow-md transition-all ease-linear duration-200 z-10`}
        >
          {props.categories.map((item: ICategory) => (
            <li
              key={item._id}
              onClick={() => props.onSelect(item)}
              className={`w-full text-base ${
                props.data._id === item._id && "bg-[#4f46e5] text-white"
              } hover:bg-[#4f46e5] hover:text-white px-5 py-1 cursor-pointer transition-all ease-linear duration-100`}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div> */}

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

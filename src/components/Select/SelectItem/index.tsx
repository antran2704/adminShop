import { FC, useState, memo } from "react";

import { FiChevronDown } from "react-icons/fi";
import { ICategory } from "~/interface/product";

interface Props {
  title: string;
  widthFull: boolean;
  data: ICategory;
  categories: ICategory[];
  onSelect: (item: ICategory) => void;
}

const SelectItem: FC<Props> = (props: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div className={`${!props.widthFull && "lg:w-1/2"} w-full`}>
      <span className="block text-base text-[#1E1E1E] font-medium mb-1">
        {props.title}
      </span>
      {/* layout to close list select item */}
      <div
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
      </div>
    </div>
  );
};

export default memo(SelectItem);

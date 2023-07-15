import { FC, useState, useRef, memo, useEffect } from "react";

import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ITypeProduct } from "~/interface/product";

interface Props {
  title: string;
  widthFull: boolean;
  data: ITypeProduct[];
  types: ITypeProduct[];
  onSelect: (item: ITypeProduct) => void;
  onDelete: (id: string | null) => void;
}

const SelectMultipleItem: FC<Props> = (props: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);

  const [show, setShow] = useState(false);
  useEffect(() => {
    if (divRef.current && popupRef.current) {
      const height = divRef.current.clientHeight;
      popupRef.current.style.top = `${height + 10}px`;
    }
  }, [show, props.types]);
  return (
    <div
      className={`${!props.widthFull && "lg:w-1/2"} ${
        props.types.length === 0 && "opacity-60 pointer-events-none"
      } w-full`}
    >
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
        ref={divRef}
        className={`relative flex items-center w-full min-h-[36px] rounded-md px-2 py-1 ${
          show && "border-[#4f46e5]"
        } border-2 outline-none cursor-pointer`}
      >
        <div className="flex items-center w-full justify-between">
          <ul className="flex flex-1 flex-wrap items-center gap-2">
            {props.data.map((item: ITypeProduct) => (
              <span
                key={item._id}
                className="flex items-center text-base bg-[#4f46e5] text-white px-2 py-1 rounded border-2 gap-2"
              >
                {item.title}
                <IoIosCloseCircleOutline
                  onClick={() => props.onDelete(item._id)}
                  className="text-2xl"
                />
              </span>
            ))}
          </ul>
          <IoAddCircleOutline
            onClick={() => setShow(!show)}
            className="ml-auto w-10 h-7"
          />
        </div>

        <ul
          ref={popupRef}
          className={`absolute ${
            show
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } scrollHidden left-0 w-full max-h-[160px] bg-white border-2 rounded-md overflow-y-auto shadow-md transition-all ease-linear duration-200 z-10`}
        >
          {props.types.map((item: ITypeProduct) => (
            <li
              key={item._id}
              onClick={() => props.onSelect(item)}
              className={`w-full text-base ${
                props.data.find((itemData: ITypeProduct) => itemData._id === item._id) && "bg-[#4f46e5] text-white"
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

export default memo(SelectMultipleItem);

import { FC, useState, useRef, memo, useEffect } from "react";

import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { ISelectItem } from "~/interface";

interface Props {
  title: string;
  className?: string;
  data: ISelectItem[];
  selects: ISelectItem[];
  // types: ITypeProduct[];
  onSelectItem: (items: ISelectItem[]) => void;
}

const initData: ISelectItem[] = [
  {
    _id: "1",
    title: "Item 1",
  },
  {
    _id: "2",
    title: "Item 2",
  },
  {
    _id: "3",
    title: "Item 3",
  },
  {
    _id: "4",
    title: "Item 4",
  },
  {
    _id: "5",
    title: "Item 5",
  },
  {
    _id: "6",
    title: "Item 6",
  },
];

const SelectMultipleItem: FC<Props> = (props: Props) => {
  const { title, className, data, selects, onSelectItem } = props;

  const divRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);

  // const [data, setData] = useState<ISelectItem[]>(initData);
  // const [selects, setSelects] = useState<ISelectItem[]>([]);
  const [show, setShow] = useState(false);

  const onSelect = (select: ISelectItem) => {
    const isExit = selects.some((item: ISelectItem) => item._id === select._id);

    if (!isExit) {
      onSelectItem([...selects, select]);
    } else {
      const newSelect = selects.filter(
        (item: ISelectItem) => item._id !== select._id
      );
      onSelectItem(newSelect);
    }
  };

  const onSelectAll = () => {
    if (selects.length !== data.length) {
      onSelectItem([...data]);
    } else {
      onSelectItem([]);
    }
  };

  useEffect(() => {
    if (divRef.current && popupRef.current) {
      const height = divRef.current.clientHeight;
      popupRef.current.style.top = `${height + 10}px`;
    }
  }, [show]);
  return (
    <div className={`${className ? className : ""}`}>
      <span className="block text-base text-[#1E1E1E] font-medium mb-1">
        {title}
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
        <div
          onClick={() => setShow(!show)}
          className="flex items-center w-full justify-between gap-5"
        >
          {selects.length > 0 && selects.length < data.length && (
            <p className="w-full line-clamp-1 gap-2">
              {selects.map(
                (item: ISelectItem, index: number) =>
                  `${item.title} ${index + 1 <= selects.length - 1 ? "," : ""}`
              )}
            </p>
          )}

          {selects.length === data.length && (
            <p className="w-full line-clamp-1 gap-2">All items selected</p>
          )}

          {selects.length === 0 && (
            <p className="w-full text-gray-400 line-clamp-1 gap-2">
              Please select item...
            </p>
          )}

          {show && <MdKeyboardArrowUp className="ml-auto w-10 h-7" />}
          {!show && <MdKeyboardArrowDown className="ml-auto w-10 h-7" />}
        </div>

        <ul
          ref={popupRef}
          className={`absolute ${
            show
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } scroll left-0 w-full max-h-[160px] bg-white border-2 rounded-md overflow-y-auto shadow-md transition-all ease-linear duration-200 z-10`}
        >
          <li
            onClick={onSelectAll}
            className={`w-full text-base ${
              selects.length === data.length ? "bg-[#4f46e5] text-white" : ""
            } px-5 py-1 border-b-2 cursor-pointer transition-all ease-linear duration-100`}
          >
            Select All
          </li>

          {data.map((item: ISelectItem) => (
            <li
              key={item._id}
              onClick={() => onSelect(item)}
              className={`w-full text-base ${
                selects.find(
                  (select: ISelectItem) => select._id === item._id
                ) && "bg-[#4f46e5] text-white"
              } px-5 py-1 cursor-pointer transition-all ease-linear duration-100`}
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

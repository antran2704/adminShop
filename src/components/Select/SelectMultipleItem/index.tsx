import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  memo,
  MouseEvent,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineClose } from "react-icons/ai";
import { ISelectItem } from "~/interface";
import { TippyInfor } from "../../Tippy";

interface Props {
  title: string;
  infor?: string | null;
  width?: string;
  name: string;
  placeholder?: string;
  data: ISelectItem[];
  select: ISelectItem[];
  error?: boolean;
  getSelect: (select: ISelectItem[]) => void;
}
const MultipleValue = (props: Props) => {
  const {
    title,
    width,
    name,
    placeholder,
    data = [],
    select = [],
    error,
    infor = null,
    getSelect,
  } = props;

  const [text, setText] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const [open, setOpen] = useState<boolean>(false);

  const handleDeleteValue = (data: ISelectItem) => {
    const newSelect = select.filter((value) => value._id !== data._id);
    getSelect(newSelect);
  };

  const onSelectAll = () => {
    if (select.length === data.length) {
      getSelect([]);
    } else {
      getSelect([...data]);
    }
  };

  const onSelectItem = (data: ISelectItem) => {
    const isExit = select.some((item) => item._id === data._id);

    if (isExit) {
      const newSelect = select.filter((item) => item._id !== data._id);
      getSelect(newSelect);
    } else {
      getSelect([...select, data]);
    }
  };

  return (
    <div className={`${width ? width : "w-full"}`}>
      <div className="flex items-center mb-1 gap-2">
        <span
          id={name}
          className="block text-base text-[#1E1E1E] dark:text-darkText font-medium"
        >
          {title}
        </span>

        {infor && <TippyInfor content={infor} />}
      </div>

      <div
        onClick={() => setOpen(!open)}
        onMouseLeave={() => setOpen(false)}
        className={`relative flex items-center flex-wrap w-full dark:bg-darkInput rounded-md px-2 py-2 border-2 ${
          error && "border-error"
        } focus:border-[#4f46e5] dark:border-transparent outline-none gap-2`}
      >
        <ul className="flex flex-wrap items-center gap-2">
          {select.map((value: ISelectItem, index: number) => (
            <li
              onClick={(e: MouseEvent<HTMLLIElement>) => {
                e.stopPropagation();
              }}
              key={index}
              className="flex items-center text-sm text-desc px-3 py-1 bg-slate-200 dark:bg-white opacity-90 hover:opacity-100 rounded gap-2"
            >
              <span>{value.title}</span>
              <AiOutlineClose
                onClick={() => handleDeleteValue(value)}
                className="text-sm min-w-[14px] cursor-pointer mt-1"
              />
            </li>
          ))}
        </ul>

        {!select.length && (
          <input
            readOnly
            id={name}
            value={text}
            name={name}
            placeholder={placeholder}
            type="text"
            className={`flex-1 min-w-[260px] border-transparent bg-transparent dark:placeholder:text-white dark:text-white pl-2 outline-none`}
          />
        )}

        <div className="after:absolute after:top-full after:left-0 after:right-0 after:h-4 after:bg-transparent z-0"></div>
        <ul
          className={`absolute ${
            open
              ? "top-[120%] opacity-100 pointer-events-auto"
              : "top-[130%] opacity-0 pointer-events-none"
          } scroll left-0 w-full max-h-[160px] bg-white border-2 rounded-md shadow-md overflow-y-auto transition-all ease-linear duration-200 z-[1]`}
        >
          <li
            onClick={(e: MouseEvent<HTMLLIElement>) => {
              e.stopPropagation();
              onSelectAll();
            }}
            className={`w-full text-base ${
              select.length === data.length ? "bg-gray-200" : ""
            } px-5 py-1 border-b-2 border-gray-300 cursor-pointer transition-all ease-linear duration-100`}
          >
            Select All
          </li>

          {data.map((item: ISelectItem) => (
            <li
              key={item._id}
              onClick={(e: MouseEvent<HTMLLIElement>) => {
                e.stopPropagation();
                onSelectItem(item);
              }}
              className={`w-full text-base ${
                select.find(
                  (selectItem: ISelectItem) => selectItem._id === item._id
                ) && "bg-gray-200"
              } px-5 py-1 cursor-pointer transition-all ease-linear duration-100`}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      {message && <p className="text-base text-error font-medium">{message}</p>}
    </div>
  );
};

export default memo(MultipleValue);

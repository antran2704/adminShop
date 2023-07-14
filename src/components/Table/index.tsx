import Link from "next/link";
import { FC, Fragment, useState, memo } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { IDataTable } from "~/interface/table";

import Popup from "~/components/Popup";

interface Props {
  colHeadTabel: string[];
  data: IDataTable[];
  href: string;
  hrefEdit: string;
  message: string | null;
  showPopup: boolean | false;
  loading: boolean;
  onShowPopup: () => void;
  onDelete: (item: IDataTable) => void;
}

const initData: IDataTable = {
  _id: null,
  title: "",
  slug: "",
  thumbnail: "",
  createdAt: "",
};

const Table: FC<Props> = (props: Props) => {
  const [selectItem, setSelectItem] = useState<IDataTable>(initData);

  const onSelectDeleteItem = (item: IDataTable) => {
    setSelectItem(item);
    props.onShowPopup();
  };

  return (
    <Fragment>
      <div className="scrollHidden overflow-x-auto">
        <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard pt-3 rounded-bl-lg rounded-br-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                {props.colHeadTabel.map((item: string, index: number) => (
                  <th
                    key={index}
                    className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-[#343a40] tracking-wider"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {!props.loading &&
                props.data.map((item: IDataTable) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-100"
                  >
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex items-center">
                        <Link
                          href={`${props.href}/${item._id}`}
                          className="text-sm leading-5 text-gray-800 font-medium"
                        >
                          {item.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <Link
                        href={`${props.href}/${item._id}`}
                        className="block w-[160px] h-[100px] rounded overflow-hidden"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover object-center"
                        />
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative font-medium text-sm">
                          active
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b font-medium border-gray-500 text-blue-900 text-sm leading-5">
                      {item.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <div className="flex items-center justify-center">
                        <Link
                          href={`${props.hrefEdit}/${item.slug}`}
                          className="block px-3 py-2 border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                        >
                          <AiOutlineEdit className="text-xl" />
                        </Link>
                        <button
                          onClick={() => onSelectDeleteItem(item)}
                          className="px-3 py-2 ml-3 border-error border-2 text-error rounded transition duration-300 hover:bg-error hover:text-white focus:outline-none"
                        >
                          <AiOutlineDelete className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {props.loading && (
                <>
                  <tr>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton w-[100px] h-5"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton block w-[160px] h-[100px] rounded overflow-hidden"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <span className="skelaton block w-[100px] h-5"></span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b font-medium border-gray-500 text-blue-900 text-sm leading-5">
                      <p className="skelaton w-[100px] h-5"></p>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <div className="flex items-center justify-center">
                        <div className="skelaton w-10 h-5 rounded"></div>
                        <div className="skelaton w-10 h-5 rounded"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton w-[100px] h-5"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton block w-[160px] h-[100px] rounded overflow-hidden"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <span className="skelaton block w-[100px] h-5"></span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b font-medium border-gray-500 text-blue-900 text-sm leading-5">
                      <p className="skelaton w-[100px] h-5"></p>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <div className="flex items-center justify-center">
                        <div className="skelaton w-10 h-5 rounded"></div>
                        <div className="skelaton w-10 h-5 rounded"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton w-[100px] h-5"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton block w-[160px] h-[100px] rounded overflow-hidden"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <span className="skelaton block w-[100px] h-5"></span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b font-medium border-gray-500 text-blue-900 text-sm leading-5">
                      <p className="skelaton w-[100px] h-5"></p>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <div className="flex items-center justify-center">
                        <div className="skelaton w-10 h-5 rounded"></div>
                        <div className="skelaton w-10 h-5 rounded"></div>
                      </div>
                    </td>
                  </tr>
                </>
              )}

              {props.message && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <p className="text-xl text-center font-medium text-error">{props.message}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Popup show={props.showPopup} onClose={props.onShowPopup}>
        <div>
          <p className="text-lg">
            Do you want delete category <strong>{selectItem?.title}</strong>
          </p>
          <div className="flex lg:flex-nowrap flex-wrap items-center justify-between mt-2 lg:gap-5 gap-2">
            <button
              onClick={() => props.onDelete(selectItem)}
              className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
            >
              Delete
            </button>
            <button className="lg:w-fit w-full text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
              Edit
            </button>
          </div>
        </div>
      </Popup>
    </Fragment>
  );
};

export default memo(Table);

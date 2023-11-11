import Link from "next/link";
import { FC, ReactNode } from "react";
import { typeCel } from "~/enums";
import { getDateTime } from "~/helper/datetimeFormat";
import ButtonCheck from "../Button/ButtonCheck";

interface Props {
  id?: string;
  type: typeCel;
  value?: string;
  data?: any;
  className?: string;
  href?: string;
  status?: string;
  checked?: boolean;
  icon?: ReactNode;
  onChangeStatus?: void;
  onGetChecked?: (id: string, status: boolean, data?: any) => void;
  onClick?(): void;
  children?: JSX.Element;
}

const CelTable: FC<Props> = (props: Props) => {
  const {id, type, value = "", className, data, href, status, checked, icon, onChangeStatus, onClick, onGetChecked, children} = props;

  switch (type) {
    case typeCel.TEXT:
      return (
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b font-medium ${className ? className : ""} sm:text-sm text-xs text-center leading-5`}
        >
          {value}
        </td>
      );

    case typeCel.DATE:
      return (
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b font-medium ${className ? className : ""} text-center text-blue-900 sm:text-sm text-xs leading-5`}
        >
          {getDateTime(value)}
        </td>
      );

    case typeCel.LINK:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b">
          <div className="flex items-center justify-center">
            <Link
              target="_blank"
              href={href ? href : "/"}
              className={`block sm:text-sm text-xs leading-5 text-gray-800 ${className ? className : ""} text-center font-medium`}
            >
              {value}
            </Link>
          </div>
        </td>
      );

    case typeCel.THUMBNAIL:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b">
          <Link
            href={href ? href : "/"}
            className="block w-[160px] h-[100px] mx-auto rounded overflow-hidden"
          >
            <img
              src={value}
              alt={value}
              className="w-full h-full object-cover object-center"
            />
          </Link>
        </td>
      );

    case typeCel.STATUS:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 sm:text-sm text-xs leading-5">
          <p
            className={`w-fit font-medium text-white ${status} capitalize mx-auto px-5 py-2 rounded-lg`}
          >
            {value}
          </p>
        </td>
      );

    case typeCel.BUTTON:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b sm:text-sm text-xs leading-5">
          <button
            onClick={onClick}
            className="px-3 py-2 mx-auto border-error border-2 text-error rounded transition duration-300 hover:bg-error hover:text-white focus:outline-none"
          >
            {icon}
          </button>
        </td>
      );

    case typeCel.GROUP:
      return (
        <td className="px-6 py-4">
          {children}
        </td>
      );

    case typeCel.BUTTON_LINK:
      return (
        <td className="whitespace-no-wrap border-b sm:text-sm text-xs leading-5">
          <Link
            href={href ? href : "/"}
            className="block w-fit px-3 py-2 border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
          >
            {icon}
          </Link>
        </td>
      );

    case typeCel.PUBLIC:
      return (
        <td className="whitespace-no-wrap border-b sm:text-sm text-xs leading-5">
          <ButtonCheck
            name="public"
            width="w-fit mx-auto"
            data={data}
            isChecked={checked as boolean}
            id={id}
            onGetChecked={onGetChecked}
          />
        </td>
      );
    default:
      return <></>;
  }
};

export default CelTable;

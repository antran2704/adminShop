import Link from "next/link";
import { FC, ReactNode } from "react";
import { typeCel } from "~/enums";

interface Props {
  type: typeCel;
  value: string;
  className?: string;
  href?: string;
  status?: string;
  icon?: ReactNode;
  onClick?(): void;
}

const CelTable: FC<Props> = (props: Props) => {
  const handleGetDate = (timestamps: string) => {
    const date = new Date(timestamps);
    return date.toLocaleDateString("en-GB", {hour: "numeric", minute: "numeric", second: "numeric"});
  };

  switch (props.type) {
    case typeCel.TEXT:
      return (
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b font-medium ${props.className} sm:text-sm text-xs text-center leading-5`}
        >
          {props.value}
        </td>
      );

    case typeCel.DATE:
      return (
        <td className={`px-6 py-4 whitespace-no-wrap border-b font-medium ${props.className} text-center text-blue-900 sm:text-sm text-xs leading-5`}>
          {handleGetDate(props.value)}
        </td>
      );

    case typeCel.LINK:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b">
          <div className="flex items-center">
            <Link
            target="_blank"
              href={props?.href ? props.href : "/"}
              className={`sm:text-sm text-xs leading-5 text-gray-800 ${props.className} text-center font-medium`}
            >
              {props.value}
            </Link>
          </div>
        </td>
      );

    case typeCel.THUMBNAIL:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b">
          <Link
            href={props?.href ? props.href : "/"}
            className="block w-[160px] h-[100px] mx-auto rounded overflow-hidden"
          >
            <img
              src={props.value}
              alt={props.value}
              className="w-full h-full object-cover object-center"
            />
          </Link>
        </td>
      );

    case typeCel.STATUS:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 sm:text-sm text-xs leading-5">
          <p
            className={`w-fit font-medium text-white ${props.status} capitalize mx-auto px-5 py-2 rounded-lg`}
          >
            {props.value}
          </p>
        </td>
      );

    case typeCel.BUTTON:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b sm:text-sm text-xs leading-5">
          <button
            onClick={props.onClick}
            className="px-3 py-2 mx-auto border-error border-2 text-error rounded transition duration-300 hover:bg-error hover:text-white focus:outline-none"
          >
            {props.icon}
          </button>
        </td>
      );

    case typeCel.BUTTON_LINK:
      return (
        <td className="px-6 py-4 whitespace-no-wrap border-b sm:text-sm text-xs leading-5">
          <Link
            href={props?.href ? props.href : "/"}
            className="block w-fit px-3 py-2 mx-auto border-blue-700 border-2 text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
          >
            {props.icon}
          </Link>
        </td>
      );
    default:
      return <></>;
  }
};

export default CelTable;

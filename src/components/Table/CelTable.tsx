import Link from "next/link";
import { FC, ReactNode, memo } from "react";
import { typeCel } from "~/enums";
import { getDateTime } from "~/helper/datetime";
import ButtonCheck from "../Button/ButtonCheck";
import { InputNumber, InputText } from "../InputField";
import SelectImage from "../Image/SelectImage";

interface Props {
  id?: string;
  name?: string;
  type: typeCel;
  value?: string;
  data?: any;
  className?: string;
  href?: string;
  status?: string;
  checked?: boolean;
  center?: boolean;
  isSelected?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  thumbnailUrl?: string | null;
  images?: string[];
  onChangeStatus?: void;
  onSelectCheckBox?: () => void;
  onGetChecked?: (id: string, status: boolean, data?: any) => void;
  onChangeImage?: (name: string, value: string) => void;
  onChangeInput?: (name: string, value: string, id?: string) => void;
  onChangeInputNumber?: (name: string, value: number, id?: string) => void;
  onClick?(): void;
  children?: JSX.Element;
}

const CelTable: FC<Props> = (props: Props) => {
  const {
    id,
    type,
    value = "",
    name,
    className,
    data,
    href,
    status,
    checked,
    center = false,
    isSelected = false,
    icon,
    placeholder,
    thumbnailUrl = null,
    images = [],
    onSelectCheckBox,
    onChangeImage,
    onChangeInput,
    onChangeInputNumber,
    onClick,
    onGetChecked,
    children,
  } = props;

  switch (type) {
    case typeCel.TEXT:
      return (
        <td
          className={`px-6 py-4 whitespace-no-wrap font-medium ${
            className ? className : ""
          } sm:text-sm text-xs ${
            center ? "text-center" : "text-start"
          } leading-5`}
        >
          {value}
        </td>
      );

    case typeCel.DATE:
      return (
        <td
          className={`px-6 py-4 whitespace-no-wrap font-medium ${
            className ? className : ""
          } ${
            center ? "text-center" : "text-start"
          } text-[#0072f5] sm:text-sm text-xs whitespace-nowrap leading-5`}
        >
          {getDateTime(value)}
        </td>
      );

    case typeCel.INPUT:
      return (
        <td
          className={`px-6 py-4 whitespace-no-wrap font-medium ${
            className ? className : ""
          } ${
            center ? "text-center" : "text-start"
          } text-blue-900 sm:text-sm text-xs leading-5`}
        >
          <InputText
            id={id}
            name={name as string}
            placeholder={placeholder}
            value={value}
            getValue={onChangeInput}
          />
        </td>
      );

    case typeCel.INPUT_NUMBER:
      return (
        <td
          className={`px-6 py-4 whitespace-no-wrap font-medium ${
            className ? className : ""
          } ${
            center ? "text-center" : "text-start"
          } text-blue-900 sm:text-sm text-xs leading-5`}
        >
          <InputNumber
            id={id}
            name={name as string}
            value={value}
            placeholder={placeholder}
            getValue={onChangeInputNumber}
          />
        </td>
      );

    case typeCel.LINK:
      return (
        <td className="px-6 py-4 whitespace-no-wrap">
          <Link
            target="_blank"
            href={href ? href : "/"}
            className={`block sm:text-sm text-xs leading-5 text-gray-800 dark:text-white ${
              className ? className : ""
            } ${center ? "text-center" : "text-start"} font-medium`}
          >
            {value}
          </Link>
        </td>
      );

    case typeCel.THUMBNAIL:
      return (
        <td className="px-6 py-4 whitespace-no-wrap">
          <Link
            href={href ? href : "/"}
            className={`block ${className ? className : 'w-[160px] h-[100px]'} mx-auto rounded overflow-hidden`}
          >
            <img
              src={process.env.NEXT_PUBLIC_ENDPOINT_API + value}
              alt={value}
              className="w-full h-full object-cover object-center"
            />
          </Link>
        </td>
      );

    case typeCel.SELECT:
      return (
        <td className="px-6 py-4 whitespace-no-wrap text-blue-900 leading-5">
          <div className="flex items-center justify-center">
            <input
              checked={isSelected}
              type="checkbox"
              onChange={onSelectCheckBox}
              id={id}
            />
          </div>
        </td>
      );

    case typeCel.SELECT_IMAGE:
      return (
        <td
          className={`px-6 py-4 sm:text-sm text-xs leading-5 text-gray-800 ${
            className ? className : ""
          } ${center ? "text-center" : "text-start"} font-medium`}
        >
          <SelectImage
            className={className}
            onChange={onChangeImage}
            name={name}
            url={thumbnailUrl}
            images={images}
          />
        </td>
      );

    case typeCel.STATUS:
      return (
        <td className="px-6 py-4 whitespace-no-wrap text-blue-900 leading-5">
          <p
            className={`w-fit font-medium text-white text-xs ${status} capitalize mx-auto px-5 py-2 rounded-lg whitespace-nowrap`}
          >
            {value}
          </p>
        </td>
      );

    case typeCel.BUTTON:
      return (
        <td className="px-6 py-4 whitespace-no-wrap sm:text-sm text-xs leading-5">
          <button
            onClick={onClick}
            className="px-3 py-2 mx-auto border-error border-2 text-error rounded transition duration-300 hover:bg-error hover:text-white focus:outline-none"
          >
            {icon}
          </button>
        </td>
      );

    case typeCel.GROUP:
      return <td className="px-6 py-4">{children}</td>;

    case typeCel.BUTTON_LINK:
      return (
        <td className="whitespace-no-wrap sm:text-sm text-xs leading-5">
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
        <td className="whitespace-no-wrap sm:text-sm text-xs leading-5">
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

export default memo(CelTable);

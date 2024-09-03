import { DatePicker, DatePickerProps } from "antd";
import clsx from "clsx";
import { Dayjs } from "dayjs";

interface Props extends DatePickerProps {
  title?: string;
  className?: string;
  borderBottom?: boolean;
  onChangeDate?: (value: string | string[], option: Dayjs) => void;
}

const DateFilter = (props: Props) => {
  const { title, className, borderBottom, onChangeDate, ...rest } = props;

  return (
    <div
      className={clsx("w-full flex flex-col gap-2", {
        "pb-4 border-b border-b-neutral-200": borderBottom,
      })}>
      {title && <p className="text-base font-medium">{title}</p>}
      <DatePicker
        onChange={(date, dateString) => {
          onChangeDate && onChangeDate(dateString as string, date);
        }}
        className={clsx("!py-2", className)}
        {...rest}
      />
    </div>
  );
};

export default DateFilter;

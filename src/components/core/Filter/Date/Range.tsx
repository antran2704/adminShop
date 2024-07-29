import { DatePicker } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import clsx from "clsx";

interface Props extends RangePickerProps {
  title?: string;
  className?: string;
  borderBottom?: boolean;
  typeDisabledDate?:
    | "disabledBeforeDays"
    | "disabledOneWeek"
    | "disabledOneMonth";
  onChangeDate?: (value: string | string[]) => void;
}

const disabledBeforeDays: DatePickerProps["disabledDate"] = (
  current,
  { from },
) => {
  if (from) {
    return Math.abs(current.diff(from, "days")) > current.diff(from, "days");
  }

  return false;
};

const disabledOneWeek: DatePickerProps["disabledDate"] = (
  current,
  { from },
) => {
  if (from) {
    return Math.abs(current.diff(from, "days")) > current.get("days");
  }

  return false;
};

const disabledOneMonth: DatePickerProps["disabledDate"] = (
  current,
  { from },
) => {
  if (from) {
    return Math.abs(current.diff(from, "days")) > current.daysInMonth();
  }

  return false;
};

const typeDisable = {
  disabledBeforeDays,
  disabledOneWeek,
  disabledOneMonth,
};

const DateRangeFilter = (props: Props) => {
  const {
    title,
    className,
    borderBottom,
    typeDisabledDate,
    onChangeDate,
    ...rest
  } = props;

  return (
    <div
      className={clsx("w-full flex flex-col gap-2", {
        "pb-4 border-b border-b-neutral-200": borderBottom,
      })}>
      {title && <p className="text-base font-medium">{title}</p>}
      <DatePicker.RangePicker
        disabledDate={typeDisabledDate && typeDisable[typeDisabledDate]}
        {...rest}
        onChange={(_, dateString) => {
          onChangeDate && onChangeDate(dateString);
        }}
        className={clsx("!py-2", className)}
      />
    </div>
  );
};

export default DateRangeFilter;

import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { useTranslations } from "next-intl";

import { InputNumber } from "~/components/Core/Input";

import { formatBigNumber } from "~/helper/format/number";
import { IHint } from "~/interface";

interface Props {
  title?: string;
  hints?: IHint[];
  from?: number;
  to?: number;
  max?: number;
  borderBottom?: boolean;
  onChangeValue: (from: number, to: number) => void;
}

const FromToFilter = (props: Props) => {
  const {
    title,
    hints = [],
    from = 0,
    to = 0,
    max,
    borderBottom,
    onChangeValue,
  } = props;

  const tFilter = useTranslations("Common.filter");

  const onChange = (newFrom: number, newTo: number) => {
    if (isNaN(newFrom) || isNaN(newTo)) return;

    if (max && newTo > max) {
      onChangeValue(newFrom, max);
      return;
    }

    if (max && newFrom > max) {
      onChangeValue(max, newTo);
      return;
    }

    onChangeValue(newFrom, newTo);
  };

  return (
    <div
      className={clsx("w-full flex flex-col gap-2", {
        "pb-4 border-b border-b-neutral-200": borderBottom,
      })}>
      {title && <p className="text-base font-medium">{title}</p>}
      <div className="flex flex-col py-2 gap-3">
        <div className="flex items-center justify-between gap-5">
          <InputNumber
            value={from > 0 ? formatBigNumber(from) : ""}
            allowClear
            placeholder={tFilter("from")}
            size="large"
            className="rounded-xl"
            classNames={{
              input: "text-center",
            }}
            status={to > 0 && from > to ? "error" : ""}
            onChangeValue={(value: number) => onChange(value, to)}
          />
          <FaArrowRightLong className="size-8" />
          <InputNumber
            value={to > 0 ? formatBigNumber(to) : ""}
            allowClear
            placeholder={tFilter("to")}
            size="large"
            classNames={{
              input: "text-center",
            }}
            className="text-center rounded-xl"
            onChangeValue={(value: number) => onChange(from, value)}
          />
        </div>

        <ul className="flex items-center justify-between flex-wrap gap-5">
          {hints.map((item: IHint) => (
            <li
              key={item.id}
              onClick={() => onChange(item.from, item.to)}
              className={clsx(
                "min-w-[100px] px-5 py-2 rounded-3xl text-sm cursor-pointer",
                [
                  item.from === from && item.to === to
                    ? "bg-[#3784FB] text-white hover:bg-[#3784FB]"
                    : "bg-neutral-100 text-neutral-300 hover:bg-neutral-200",
                ],
              )}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FromToFilter;

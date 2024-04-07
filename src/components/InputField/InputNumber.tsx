import { ChangeEvent, FC, KeyboardEvent, memo } from "react";
import { TippyInfor } from "../Tippy";
import { IInputNumber } from "./interface";
import { revertPriceToString } from "~/helper/number/fomatterCurrency";
import handleCheckValidNumber from "~/helper/number";
import { SIZE } from ".";

const InputNumberField: FC<IInputNumber> = (props: IInputNumber) => {
  const {
    title,
    width,
    name,
    placeholder,
    value,
    size = "S",
    infor = null,
    readonly = false,
    required = false,
    enableEnter = false,
    error,
    onEnter,
    getValue,
  } = props;

  const handleChangeValue = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (readonly) return;

    const name = e.target.name;
    const value = Number(revertPriceToString(e.target.value));

    const valid = handleCheckValidNumber(value);

    if (name && getValue) {
      if (valid) {
        getValue(name, value);
      }
      if (value <= 0) {
        getValue(name, 0);
      }
    }
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (readonly) return;

    const key = e.key;
    if (key === "Enter" && onEnter) {
      onEnter();
    }
  };

  return (
    <div className={`${width ? width : "w-full"}`}>
      {title && (
        <div className="flex items-center mb-1 gap-2">
          <span
            id={name}
            className="block text-base text-[#1E1E1E] dark:text-[#ecedee] font-medium"
          >
            {title}
          </span>

          {infor && <TippyInfor content={infor} />}
        </div>
      )}

      <input
        required={required}
        name={name}
        value={value}
        placeholder={placeholder}
        readOnly={readonly}
        onKeyUp={(e) => {
          if (enableEnter) {
            onKeyUp(e);
          }
        }}
        onInput={handleChangeValue}
        type="text"
        className={`w-full rounded-md ${SIZE[size]} border-2 ${
          error && "border-error"
        } ${
          readonly ? "pointer-events-none cursor-not-allowed opacity-80" : ""
        } focus:border-[#4f46e5] dark:bg-[#27272a] dark:text-white outline-none`}
      />
    </div>
  );
};

export default memo(InputNumberField);

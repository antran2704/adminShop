import { FC, ChangeEvent, FormEvent, KeyboardEvent, memo } from "react";

import handleCheckValidNumber from "~/helper/number";
import { typeInput } from "~/enums";
import { TippyInfor } from "../Tippy";
import {
  formatBigNumber,
  revertPriceToString,
} from "~/helper/number/fomatterCurrency";

interface Props {
  id?: string | null;
  title?: string;
  width?: string;
  name: string;
  type: string;
  placeholder?: string;
  cols?: number;
  rows?: number;
  value?: string;
  error?: boolean;
  readonly?: boolean;
  enableEnter?: boolean;
  infor?: string | null;
  onEnter?: () => void;
  getValue?: (name: string, value: string, id?: string) => void;
  getNumber?: (name: string, value: number, id?: string) => void;
}
const FieldAdd: FC<Props> = (props: Props) => {
  const {
    id,
    title,
    width,
    name,
    placeholder,
    type,
    value,
    infor = null,
    cols = 30,
    rows = 6,
    readonly = false,
    enableEnter = false,
    error,
    onEnter,
    getValue,
    getNumber,
  } = props;

  const handleChangeValue = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (readonly) return;

    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    if (getValue && id) {
      getValue(name, value, id);
    }

    if (getValue) {
      getValue(name, value);
    }
  };

  const handleChangeNumberValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (readonly) return;

    const name = e.target.name;
    const value = Number(revertPriceToString(e.target.value));

    const valid = handleCheckValidNumber(value);

    if (name && getNumber) {
      if (valid) {
        getNumber(name, value);
      }
      if (value <= 0) {
        getNumber(name, 0);
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
            className="block text-base text-[#1E1E1E] font-medium"
          >
            {title}
          </span>

          {infor && <TippyInfor content={infor} />}
        </div>
      )}

      {type === typeInput.input && (
        <input
          required
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
          className={`w-full rounded-md px-2 py-1 border-2 ${
            error && "border-error"
          } ${
            readonly ? "pointer-events-none cursor-not-allowed opacity-80" : ""
          } focus:border-[#4f46e5] outline-none`}
        />
      )}

      {type === typeInput.number && (
        <input
          required
          name={name}
          value={value}
          placeholder={placeholder}
          onInput={handleChangeNumberValue}
          type="text"
          className={`w-full rounded-md px-2 py-1 border-2 ${
            error && "border-error"
          } ${
            readonly ? "pointer-events-none cursor-not-allowed opacity-80" : ""
          } focus:border-[#4f46e5] outline-none`}
        />
      )}

      {type === typeInput.textarea && (
        <textarea
          className={`w-full rounded-md px-2 py-1 border-2  ${
            error && "border-error"
          } focus:border-[#4f46e5] outline-none`}
          name={name}
          value={value}
          onInput={handleChangeValue}
          placeholder={placeholder}
          cols={cols}
          rows={rows}
        ></textarea>
      )}
    </div>
  );
};

export default memo(FieldAdd);

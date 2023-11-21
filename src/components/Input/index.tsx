import { FC, ChangeEvent, FormEvent, KeyboardEvent, memo } from "react";
import handleCheckValidNumber from "~/helper/number";

import { typeInput } from "~/enums";

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
  onEnter?: () => void;
  getValue?: (name: string, value: string, id?: string) => void;
  getNumber?: (name: string, value: number) => void;
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
    const name = e.target.name;
    const value = Number(e.target.value);

    const valid = handleCheckValidNumber(value);

    if (name && getNumber) {
      if (valid) {
        getNumber(name, value);
      }
      if (Number(value) <= 0) {
        getNumber(name, 0);
      }
    }
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === "Enter" && onEnter) {
      console.log("enter")
      onEnter();
    }
  };

  return (
    <div className={`${width ? width : "w-full"}`}>
      {title && (
        <span
          id={name}
          className="block text-base text-[#1E1E1E] font-medium mb-1"
        >
          {title}
        </span>
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

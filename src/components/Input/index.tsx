import { FC, ChangeEvent, FormEvent, memo } from "react";
import handleCheckValidNumber from "~/helper/checkNumber";

import { typeInput } from "~/enums";

interface Props {
  title: string;
  width?: string;
  name: string;
  type: string;
  placeholder?: string;
  value?: string;
  error?: boolean
  readonly?: boolean;
  onClick?: () => void;
  getValue?: (name: string, value: string) => void;
  getNumber?: (name: string, value: number) => void;
}
const FieldAdd: FC<Props> = (props: Props) => {
  const { title, width, name, placeholder, type, value, readonly = false, error, getValue, getNumber } =
    props;

  const handleChangeValue = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    if (getValue) {
      getValue(name, value);
    }
  };

  const handleChangeNumberValue = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    const valid = handleCheckValidNumber(value);

    if (name && getNumber) {
      if (valid) {
        getNumber(name, Number(value));
      }
      if (Number(value) <= 0) {
        getNumber(name, 0);
      }
    }
  };

  return (
    <div className={`${width ? width : "w-full"}`}>
      <span id={name} className="block text-base text-[#1E1E1E] font-medium mb-1">
        {title}
      </span>

      {type === typeInput.input && (
        <input
          required
          name={name}
          value={value}
          placeholder={placeholder}
          readOnly={readonly}
          onInput={handleChangeValue}
          type="text"
          className={`w-full rounded-md px-2 py-1 border-2 ${error && 'border-error'} focus:border-[#4f46e5] outline-none`}
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
          className="w-full rounded-md px-2 py-1 border-2 focus:border-[#4f46e5] outline-none"
        />
      )}

      {type === typeInput.textarea && (
        <textarea
          className={`w-full rounded-md px-2 py-1 border-2  ${error && 'border-error'} focus:border-[#4f46e5] outline-none`}
          name={name}
          value={value}
          onInput={handleChangeValue}
          placeholder={placeholder}
          cols={30}
          rows={6}
        ></textarea>
      )}
    </div>
  );
};

export default memo(FieldAdd);

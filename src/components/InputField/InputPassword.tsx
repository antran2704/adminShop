import { useState, FC, FormEvent, KeyboardEvent, memo } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import { TippyInfor } from "../Tippy";
import { IInputText } from "./interface";
import { SIZE } from ".";

const InputField: FC<IInputText> = (props: IInputText) => {
  const {
    id,
    title,
    width,
    name,
    placeholder,
    value,
    infor = null,
    readonly = false,
    enableEnter = false,
    size = "S",
    error,
    required = false,
    onEnter,
    getValue,
  } = props;

  const [show, setShow] = useState<boolean>(false);

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
            className="block text-base text-[#1E1E1E]  dark:text-darkText font-medium"
          >
            {title}
          </span>

          {infor && <TippyInfor content={infor} />}
        </div>
      )}

      <div
        className={`relative w-full ${SIZE[size]} rounded-md border-2 dark:border-transparent ${
          error && "border-error"
        } ${
          readonly ? "pointer-events-none cursor-not-allowed opacity-80" : ""
        } focus:border-[#4f46e5] dark:focus:border-[#4f46e5] dark:bg-darkInput dark:text-white outline-none`}
      >
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
          type={show ? "text" : "password"}
          className={`w-full pr-8 bg-transparent border-0 outline-none`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute flex items-center justify-center right-0 top-1/2 -translate-y-1/2 w-10 h-full z-10 outline-none select-none"
        >
          {!show && <IoMdEye />}
          {show && <IoMdEyeOff />}
        </button>
      </div>
    </div>
  );
};

export default memo(InputField);

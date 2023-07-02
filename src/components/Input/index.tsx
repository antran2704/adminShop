import { FC, ChangeEvent, FormEvent, memo } from "react";
import handleCheckValidNumber from "~/helper/checkNumber";

import { typeInput } from "~/enums";

interface Props {
  title: string;
  widthFull: boolean;
  name: string;
  type: string;
  value?: string | number | readonly string[] | undefined;
  checkValidNumber?: boolean;
  onClick?: () => void;
  onGetValue: (
    name: string | undefined,
    value: string | number | boolean
  ) => void;
}
const FieldAdd: FC<Props> = (props: Props) => {
  const handleChangeInpValue = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    let value = e.target.value;
    if (props.checkValidNumber) {
      const valid = handleCheckValidNumber(value);
      if (valid) {
        props.onGetValue(name, value);
      }
      if (value.length <= 0) {
        value = "";
        props.onGetValue(name, value);
      }
    } else {
      props.onGetValue(name, value);
    }
  };

  const handleChangeTextareaValue = (e: FormEvent<HTMLTextAreaElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    props.onGetValue(name, value);
  };

  return (
    <div className={`${!props.widthFull && "lg:w-1/2"} w-full`}>
      <span className="block text-base text-[#1E1E1E] font-medium mb-1">
        {props.title}
      </span>

      {props.type === typeInput.input && (
        <input
          required
          name={props.name}
          value={props.value}
          onInput={handleChangeInpValue}
          type="text"
          className="w-full rounded-md px-2 py-1 border-2 focus:border-[#4f46e5] outline-none"
        />
      )}

      {props.type === typeInput.textarea && (
        <textarea
          className="w-full rounded-md px-2 py-1 border-2 focus:border-[#4f46e5] outline-none"
          name={props.name}
          value={props.value}
          onInput={handleChangeTextareaValue}
          placeholder="Description about product..."
          cols={30}
          rows={6}
        ></textarea>
      )}
    </div>
  );
};

export default memo(FieldAdd);

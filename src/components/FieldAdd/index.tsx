import { FC, ChangeEvent, MouseEvent, FormEvent, memo } from "react";
import handleCheckValidNumber from "~/helper/checkNumber";

enum type {
  input = "input",
  select = "select",
  button = "button",
  textarea = "textarea",
}

interface IOptionSelect {
  _id: string;
  title: string;
  options?: string;
}

interface props {
  title: string;
  widthFull: boolean;
  name: string;
  type: string;
  value?: string | number | readonly string[] | undefined;
  optionsSelect?: IOptionSelect[];
  isChecked?: boolean;
  checkValidNumber?: boolean
  onClick?: () => void;
  onGetValue: (name: string | undefined, value: string | number | boolean) => void;
}
const FieldAdd: FC<props> = (props: props) => {
  const handleChangeInpValue = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    let value = e.target.value;
    if (props.checkValidNumber) {
      const valid = handleCheckValidNumber(value);
      if (valid) {
        props.onGetValue(name, value);
      }
      if(value.length <= 0) {
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

  const handleSelectValue = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    props.onGetValue(name, value);
  };

  const handleButtonValue = (e: MouseEvent<HTMLSpanElement>) => {
    if (e.currentTarget) {
      const name = e.currentTarget.dataset.name;
      const value = !props.isChecked;
      props.onGetValue(name, value);
    }
  };

  return (
    <div className={`${!props.widthFull && "lg:w-1/2"} w-full`}>
      <span className="block text-base text-[#1E1E1E] font-medium mb-1">
        {props.title}
      </span>

      {props.type === type.input && (
        <input
          required
          name={props.name}
          value={props.value}
          onInput={handleChangeInpValue}
          type="text"
          className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
        />
      )}

      {props.type === type.textarea && (
        <textarea
          className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
          name={props.name}
          value={props.value}
          onInput={handleChangeTextareaValue}
          placeholder="Description about product..."
          cols={30}
          rows={6}
        ></textarea>
      )}

      {props.type === type.select && (
        <select
          name={props.name}
          onChange={handleSelectValue}
          className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
          defaultValue={props.value}
        >
          <option disabled>Choose category</option>
          {props.optionsSelect?.map((item: IOptionSelect) => (
            <option key={item._id} value={item.options ? item.options : item._id}>
              {item.title}
            </option>
          ))}
        </select>
      )}

      {props.type === type.button && (
        <button
          className={`relative w-[60px] h-8 ${
            !props.isChecked ? "bg-black" : "bg-success"
          } rounded-3xl transition-all ease-linear duration-200`}
        >
          <span
            data-name={props.name}
            onClick={handleButtonValue}
            className={`absolute top-1/2 ${
              props.isChecked ? "left-1/2" : "left-1"
            } -translate-y-1/2 block rounded-full w-6 h-6 bg-white transition-all ease-linear duration-100`}
          ></span>
        </button>
      )}
    </div>
  );
};

export default memo(FieldAdd);

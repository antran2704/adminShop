import { FC, ChangeEvent, MouseEvent, FormEvent } from "react";

enum type {
  input = "input",
  select = "select",
  button = "button",
  textarea = "textarea",
}

interface prop {
  title: string;
  widthFull: boolean;
  name: string;
  type: string;
  value?: string | number | readonly string[] | undefined;
  optionsSelect?: string[];
  isChecked?: boolean;
  onClick?: () => void;
  onGetValue: (name: string, value: string | number | boolean) => void;
}
const FieldAdd: FC<prop> = (prop: prop) => {
  const handleChangeInpValue = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    prop.onGetValue(name, value);
  };

  const handleChangeTextareaValue = (e: FormEvent<HTMLTextAreaElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    
    prop.onGetValue(name, value);
  };

  const handleSelectValue = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    prop.onGetValue(name, value);
  };

  const handleButtonValue = (e: MouseEvent<HTMLSpanElement>) => {
    if(e.currentTarget) {
      const name = e.currentTarget.dataset.name;
      const value = !prop.isChecked;
      prop.onGetValue(name, value);
      prop.onClick?.();
    }
  };

  return (
    <div className={`${!prop.widthFull && "lg:w-1/2"} w-full`}>
      <span className="block text-base text-[#1E1E1E] font-medium mb-1">
        {prop.title}
      </span>

      {prop.type === type.input && (
        <input
          required
          name={prop.name}
          value={prop.value}
          onInput={handleChangeInpValue}
          type="text"
          className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
        />
      )}

      {prop.type === type.textarea && (
        <textarea
          className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
          name={prop.name}
          value={prop.value}
          onInput={handleChangeTextareaValue}
          placeholder="Description about product..."
          cols={30}
          rows={6}
        ></textarea>
      )}

      {prop.type === type.select && (
        <select
          name={prop.name}
          onChange={handleSelectValue}
          className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
          defaultValue={prop.value}
        >
          <option disabled>Choose category</option>
          {prop.optionsSelect?.map((item: string, index: number) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      )}

      {prop.type === type.button && (
        <button
          className={`relative w-[60px] h-8 ${
            !prop.isChecked ? "bg-black" : "bg-success"
          } rounded-3xl transition-all ease-linear duration-200`}
        >
          <span
            data-name={prop.name}
            onClick={handleButtonValue}
            className={`absolute top-1/2 ${
              prop.isChecked ? "left-1/2" : "left-1"
            } -translate-y-1/2 block rounded-full w-6 h-6 bg-white transition-all ease-linear duration-100`}
          ></span>
        </button>
      )}
    </div>
  );
};

export default FieldAdd;

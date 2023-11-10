import { useState, ChangeEvent, KeyboardEvent, memo } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  title: string;
  width?: string;
  name: string;
  placeholder?: string;
  items: string[];
  error?: boolean;
  onClick?: () => void;
  getAttributes: (name: string, values: string[]) => void;
}

const MultipleValue = (props: Props) => {
  const { title, width, name, placeholder, items, error, getAttributes } = props;

  const [values, setValues] = useState<string[]>(items);
  const [text, setText] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleAddValue = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === "Enter") {
      const value = e.currentTarget.value;

      if (value.length <= 0) {
        setMessage("Please input value");
        return;
      }

      const newValues = [...values, value];

      setText("");
      setMessage(null);
      setValues(newValues);
      getAttributes(name, newValues);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 20) {
      setMessage("Value must less than 20 characters");
      return;
    }

    setMessage(null);
    setText(value);
  };

  const handleDeleteValue = (name: string) => {
    const items = values.filter((value) => value !== name);
    setValues(items);
    getAttributes(name, items)
  };

  return (
    <div className={`${width ? width : "w-full"}`}>
      <span
        id={name}
        className="block text-base text-[#1E1E1E] font-medium mb-1"
      >
        {title}
      </span>

      <div
        className={`flex items-center flex-wrap w-full rounded-md px-2 py-2 border-2 ${
          error && "border-error"
        } focus:border-[#4f46e5] outline-none gap-2`}
      >
        <ul className="flex flex-wrap items-center gap-2">
          {values.map((value: string, index: number) => (
            <li
              key={index}
              className="flex items-center text-sm text-desc px-3 py-1 bg-slate-200 opacity-90 hover:opacity-100 rounded gap-2"
            >
              <span>{value}</span>
              <AiOutlineClose
                onClick={() => handleDeleteValue(value)}
                className="text-sm min-w-[14px] cursor-pointer mt-1"
              />
            </li>
          ))}
        </ul>

        <input
          required
          id={name}
          value={text}
          name={name}
          placeholder={placeholder}
          onKeyUp={handleAddValue}
          onChange={onChange}
          type="text"
          className={`flex-1 border-transparent outline-none`}
        />
      </div>

      {message && <p className="text-base text-error font-medium">{message}</p>}
    </div>
  );
};

export default memo(MultipleValue);

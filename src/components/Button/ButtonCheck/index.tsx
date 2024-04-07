import { FC,memo, useState } from "react";

interface Props {
  id?: string;
  title?: string;
  data?: any;
  name: string;
  isChecked: boolean;
  width?: string;
  onChange?: (name: string, status: boolean) => void;
  onGetChecked?: (id: string, status: boolean, data?: any) => void;
}

const ButtonCheck: FC<Props> = (props: Props) => {
  const { id, title, name, isChecked, width, data, onGetChecked, onChange } = props;
  const [check, setCheck] = useState<boolean>(isChecked);

  const handleButtonValue = () => {
    if (id && onGetChecked) {
      onGetChecked(id, !check, data);
    }

    if (name && onChange) {
      onChange(name, !check);
    }

    setCheck(!check);
  };

  return (
    <div className={`${width ? width : "w-full"}`}>
      {title && (
        <span className="block text-base text-[#1E1E1E] dark:text-darkText font-medium mb-1">
          {title}
        </span>
      )}
      <button
        onClick={handleButtonValue}
        className={`relative w-[50px] h-6 ${
          !check ? "bg-black" : "bg-success"
        } rounded-3xl transition-all ease-linear duration-200`}
      >
        <span
          className={`absolute top-1/2 ${
            check ? "left-[60%]" : "left-1"
          } -translate-y-1/2 block rounded-full w-4 h-4 bg-white transition-all ease-linear duration-100`}
        ></span>
      </button>
    </div>
  );
};

export default memo(ButtonCheck);

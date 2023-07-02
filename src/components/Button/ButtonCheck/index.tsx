import { FC, MouseEvent, memo } from "react";

interface Props {
  title: string;
  name: string;
  isChecked?: boolean;
  widthFull: boolean;
  onGetValue: (
    name: string | undefined,
    value: string | number | boolean
  ) => void;
}

const ButtonCheck: FC<Props> = (props: Props) => {
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
    </div>
  );
};

export default memo(ButtonCheck);

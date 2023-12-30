import SpringCount from "../SpringCount";
import { ReactElement } from "react";

interface Props {
  title: string;
  IconElement?: ReactElement<any, any>;
  backgroundColor?: string;
  duration?: number;
  specialCharacter?: string;
  to: number;
}

const Statistic = (props: Props) => {
  const {
    title,
    IconElement,
    backgroundColor,
    duration = 0.5,
    to,
    specialCharacter,
  } = props;
  return (
    <div
      className={`flex flex-col items-center w-full ${backgroundColor} text-white px-5 py-10 rounded-xl gap-2`}
    >
      {IconElement}
      <p className="md:text-xl text-lg text-center font-medium">{title}</p>
      <SpringCount
        className="text-2xl font-bold"
        from={0}
        to={to}
        specialCharacter={specialCharacter}
        duration={duration}
      />
    </div>
  );
};

export default Statistic;

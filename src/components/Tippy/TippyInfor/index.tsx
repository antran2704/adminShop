import { IoIosInformationCircleOutline } from "react-icons/io";
import Tippy from "@tippyjs/react";

interface Props {
  content: string;
  className?: string;
}

const TippyInfor = (props: Props) => {
  const { content, className } = props;

  return (
    <Tippy
      content={content}
      className={`${className} bg-primary text-white px-5 py-1 rounded-lg`}
      interactive={true}
      interactiveBorder={20}
      placement="top"
    >
      <button>
        <IoIosInformationCircleOutline className="text-xl cursor-pointer" />
      </button>
    </Tippy>
  );
};

export default TippyInfor;

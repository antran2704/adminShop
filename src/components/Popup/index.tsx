import { FC, memo } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import LayoutClose from "./components/LayoutClose";

interface Props {
  children: JSX.Element;
  title: string;
  show: boolean;
  img?: string;
  onClose: () => void;
}

const Popup: FC<Props> = (props: Props) => {
  const { title, show, children, img, onClose } = props;
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        show
          ? "show__popup pointer-events-auto"
          : "hide__popup pointer-events-none"
      } z-[9999]`}
    >
      {show && <LayoutClose onClose={onClose} />}
      <div className="scroll absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-full max-h-[600px] bg-white dark:bg-[#1f2937] p-5 rounded-lg overflow-y-auto z-20">
        <div
          onClick={onClose}
          className="w-fit text-3xl dark:text-darkText ml-auto px-5 cursor-pointer"
        >
          <AiOutlineCloseCircle />
        </div>
        {img && (
          <div className="flex items-center justify-center">
            <img src={img} />
          </div>
        )}

        <h2 className=" md:text-2xl sm:text-lg text-base font-medium text-text dark:text-darkText text-center mb-5">
          {title}
        </h2>

        <div className="px-5 py-2 ">{children}</div>
      </div>
    </div>
  );
};

export default memo(Popup);

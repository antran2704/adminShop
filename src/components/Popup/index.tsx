import { FC, memo } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import LayoutClose from "./components/LayoutClose";

interface Props {
  children: JSX.Element;
  title: string;
  show: boolean;
  onClose: () => void;
}

const Popup: FC<Props> = (props: Props) => {
  const { title, show, children, onClose } = props;
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        show
          ? "show__popup pointer-events-auto"
          : "hide__popup pointer-events-none"
      } z-[9999]`}
    >
      {show && <LayoutClose onClose={onClose} />}
      <div className="scroll absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-full max-h-[600px] bg-white p-5 rounded-lg overflow-y-auto z-20">
        <div
          onClick={onClose}
          className="w-fit text-3xl ml-auto px-5 cursor-pointer"
        >
          <AiOutlineCloseCircle />
        </div>
        <h2 className="md:text-xl sm:text-lg text-base font-medium text-text text-center mb-5">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
};

export default memo(Popup);

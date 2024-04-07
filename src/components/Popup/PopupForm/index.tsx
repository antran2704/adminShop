import { AiOutlineCloseCircle } from "react-icons/ai";
import LayoutClose from "../components/LayoutClose";

interface Props {
  children: JSX.Element;
  title: string;
  description: string;
  show: boolean;
  onClose: () => void;
}

const PopupForm = (props: Props) => {
  const { title, show, description, children, onClose } = props;

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 ${
        show ? "pointer-events-auto" : "pointer-events-none"
      } z-[1000]`}
    >
      {show && <LayoutClose onClose={onClose} />}

      <div
        className={`scroll absolute top-0 bottom-0 ${
          show ? "right-0 opacity-100" : "-right-full opacity-0"
        } lg:w-1/2 bg-white dark:bg-[#1f2937] transition-all ease-in-out duration-200 overflow-y-auto z-20`}
      >
        <div className="flex items-center justify-between h-1/6 pb-2 px-5 border-b gap-10">
          <div>
            <h2 className="md:text-xl sm:text-lg text-base font-medium text-text dark:text-darkText">
              {title}
            </h2>
            <p className="text-sm text-desc dark:text-darkText">{description}</p>
          </div>

          <AiOutlineCloseCircle
            onClick={onClose}
            className="text-3xl dark:text-darkText min-w-[30px] cursor-pointer"
          />
        </div>

        <div className="h-5/6 pt-5">{children}</div>
      </div>
    </div>
  );
};

export default PopupForm;

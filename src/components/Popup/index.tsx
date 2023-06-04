import { Children, FC } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface props {
  children: JSX.Element;
  show: boolean;
  onClose: () => void;
}

const Popup: FC<props> = (props: props) => {
  return (
    <div className={`fixed top-0 left-0 right-0 bottom-0 ${props.show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all ease-linear duration-200 z-[9999]`}>
      <div onClick={props.onClose} className="absolute w-full h-full bg-black opacity-60 z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-full bg-white p-5 rounded-lg z-20">
        <div onClick={props.onClose} className="w-fit text-3xl ml-auto px-5 cursor-pointer">
          <AiOutlineCloseCircle />
        </div>
        <h2 className="md:text-2xl font-medium text-text text-center mb-5">
          Tile
        </h2>

        {props.children}
      </div>
    </div>
  );
};

export default Popup;

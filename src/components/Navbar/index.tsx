import { FaBars } from "react-icons/fa";
import { useAppSelector } from "~/store/hooks";
import Notification from "../Notification";
import { Dispatch, SetStateAction } from "react";

interface Props {
  showSideBar: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
}

const Navbar = (props: Props) => {
  const { showSideBar, setShowSideBar } = props;

  const { infor } = useAppSelector((state) => state.user);

  return (
    <div className="sticky top-0 flex justify-end items-center bg-white dark:bg-[#1f2937cc] backdrop-blur-[8px] px-5 py-2 shadow rounded-l-md gap-2 z-30">
      <button
        className="flex items-center justify-center w-10 h-10 rounded-md opacity-90 hover:opacity-100 transition-all ease-linear duration-100 z-10"
        onClick={() => setShowSideBar(!showSideBar)}
      >
        <FaBars className="text-xl dark:text-darkText" />
      </button>

      {infor._id && <Notification />}
    </div>
  );
};

export default Navbar;

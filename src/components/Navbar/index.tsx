import { FaBars } from "react-icons/fa";
import { useAppSelector } from "~/store/hooks";
import Notification from "../Notification";
import Translation from "../Translation";
import DarkMode from "../DarkMode";

interface Props {
  onShowModal: () => void;
}

const Navbar = (props: Props) => {
  const { onShowModal } = props;

  const { infor } = useAppSelector((state) => state.user);

  return (
    <div className="sticky top-0 flex justify-between items-center bg-white dark:bg-[#1f2937cc] backdrop-blur-[8px] px-5 py-2 shadow rounded-l-md gap-2 z-30">
      <button
        className="flex items-center justify-center w-10 h-10 rounded-md opacity-90 hover:opacity-100 transition-all ease-linear duration-100 z-10"
        onClick={onShowModal}>
        <FaBars className="text-xl dark:text-darkText" />
      </button>

      <div className="flex items-center gap-2">
        <Translation />
        <DarkMode />
        {infor._id && <Notification />}
      </div>
    </div>
  );
};

export default Navbar;

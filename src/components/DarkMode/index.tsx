import { FaRegMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { handleChangeMode } from "~/helper/darkMode";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

const DarkMode = () => {
  const { darkMode } = useAppSelector((state) => state.setting);
  const dispatch = useAppDispatch();

  const onChangeMode = () => {
    handleChangeMode(darkMode, dispatch);
  };

  return (
    <button
      onClick={onChangeMode}
      className="p-2 hover:bg-slate-200 dark:text-darkText dark:hover:text-black rounded-full"
    >
      {!darkMode && <FaRegMoon className="text-xl" />}
      {darkMode && <MdOutlineWbSunny className="text-xl" />}
    </button>
  );
};

export default DarkMode;

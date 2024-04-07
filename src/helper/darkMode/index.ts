import { AppDispatch } from "~/store";
import { changeMode } from "~/store/slice/setting";

const checkDarkMode = (dispatch: AppDispatch) => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
    dispatch(changeMode(true));
  } else {
    document.documentElement.classList.remove("dark");
    dispatch(changeMode(false));
  }
};

const handleChangeMode = (darkMode: boolean, dispatch: AppDispatch) => {
  if (darkMode) {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    dispatch(changeMode(false));
  } else {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    dispatch(changeMode(true));
  }
};

export { checkDarkMode, handleChangeMode };

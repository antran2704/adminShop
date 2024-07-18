import { useEffect } from "react";

import { useAppDispatch } from "~/store/hooks";

import { injectStore } from "~/configs/configAxios";
import { checkDarkMode } from "~/helper/darkMode";
interface Props {
  children: JSX.Element;
}

const MainLayout = ({ children }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // init store of redux for axios
    injectStore(dispatch);
    checkDarkMode(dispatch);
  }, []);

  return children;
};

export default MainLayout;

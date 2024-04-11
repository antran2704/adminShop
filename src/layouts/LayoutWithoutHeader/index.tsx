import { useEffect } from "react";
import DarkMode from "~/components/DarkMode";
import Translation from "~/components/Translation";
import { checkDarkMode } from "~/helper/darkMode";
import { useAppDispatch } from "~/store/hooks";

interface Props {
  children: JSX.Element;
}

const LayoutWithoutHeader = ({ children }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkDarkMode(dispatch);
  }, []);

  return (
    <main className="bg_login relative flex items-center justify-center h-screen">
      <div className="fixed top-5 right-5">
        <Translation />
      </div>

      {children}

      <div className="fixed bottom-5 right-5 rounded-full dark:bg-darkInput bg-white transition-all ease-linear duration-100">
        <DarkMode />
      </div>
    </main>
  );
};

export default LayoutWithoutHeader;

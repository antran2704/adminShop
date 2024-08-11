import { useEffect } from "react";

import { useAppDispatch } from "~/store/hooks";

import {
  injectRouter,
  injectStore,
  injectTranlate,
} from "~/configs/configAxios";
import { checkDarkMode } from "~/helper/darkMode";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
interface Props {
  children: JSX.Element;
}

const GlobalLayout = ({ children }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const t = useTranslations();

  useEffect(() => {
    injectRouter(router);
    injectTranlate(t);
    // init store of redux for axios
    injectStore(dispatch);
    checkDarkMode(dispatch);
  }, []);

  return children;
};

export default GlobalLayout;

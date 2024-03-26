import "~/styles/globals.scss";
import type { AppProps } from "next/app";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "../store";

import LAYOUT from "~/layouts";
import { useEffect } from "react";
import { injectRouter } from "~/ultils/configAxios";
import { useRouter } from "next/router";
import { AppPropsWithLayout } from "~/interface/page";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const pathName = usePathname();
  let Layout;
  const getLayout = Component.getLayout ?? ((page) => page);
  switch (pathName) {
    case "/login":
    case "/password/reset":
    case "/check/password-key":
      Layout = LAYOUT.LoginLayout;
      break;

    default:
      Layout = LAYOUT.DefaultLayout;
  }

  useEffect(() => {
    injectRouter(router);
  }, []);

  return (
    <Provider store={store}>{getLayout(<Component {...pageProps} />)}</Provider>
  );
}

import "~/styles/globals.scss";
import type { AppProps } from "next/app";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "../store";

import LAYOUT from "~/layouts";

export default function App({ Component, pageProps }: AppProps) {
  const pathName = usePathname();
  let Layout;

  switch (pathName) {
    case "/login":
      Layout = LAYOUT.LoginLayout;
      break;

    default:
      Layout = LAYOUT.DefaultLayout;
  }

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

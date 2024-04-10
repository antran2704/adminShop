import "~/styles/globals.scss";
import { Provider } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { store } from "../store";

import { useEffect } from "react";
import { injectRouter } from "~/ultils/configAxios";
import { useRouter } from "next/router";
import { AppPropsWithLayout } from "~/interface/page";

import "../ultils/i18";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    injectRouter(router);
  }, []);

  return (
    <Provider store={store}>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer
        autoClose={5000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </Provider>
  );
}

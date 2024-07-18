import "~/styles/globals.scss";
import { Provider } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { store } from "../store";

import { Fragment, useEffect } from "react";
import { injectRouter } from "~/configs/configAxios";
import { useRouter } from "next/router";
import { AppPropsWithLayout } from "~/interface/page";
import { appWithTranslation } from "next-i18next";
import MainLayout from "~/layouts/MainLayout";

function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    injectRouter(router);
  }, []);

  return (
    <Provider store={store}>
      <MainLayout>
        <Fragment>
          {getLayout(<Component {...pageProps} />)}
          <ToastContainer
            autoClose={5000}
            pauseOnFocusLoss={false}
            pauseOnHover={false}
          />
        </Fragment>
      </MainLayout>
    </Provider>
  );
}

export default appWithTranslation(App);

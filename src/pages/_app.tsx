import { Fragment, useEffect } from "react";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { NextIntlClientProvider } from "next-intl";
import { ConfigProvider } from "antd";

import { store } from "../store";

import { injectRouter } from "~/configs/configAxios";
import { AppPropsWithLayout } from "~/interface/page";
import MainLayout from "~/layouts/MainLayout";

import "react-toastify/dist/ReactToastify.css";
import "~/styles/globals.scss";
import themeConfig from "~/configs/antd/themeConfig";

function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    injectRouter(router);
  }, []);

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Europe/Vienna"
      messages={pageProps.messages}>
      <Provider store={store}>
        <ConfigProvider theme={themeConfig}>
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
        </ConfigProvider>
      </Provider>
    </NextIntlClientProvider>
  );
}

export default App;

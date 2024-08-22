import { Fragment } from "react";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";
import { ConfigProvider } from "antd";

import { store } from "../store";

import { AppPropsWithLayout } from "~/interface/page";
import MainLayout from "~/layouts/GlobalLayout";

import "~/styles/globals.scss";
import "~/styles/UploadFile.component.scss";
import "~/styles/UploadImage.component.scss";
import themeConfig from "~/configs/antd/themeConfig";

function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Europe/Vienna"
      messages={pageProps.messages}>
      <Provider store={store}>
        <ConfigProvider theme={themeConfig}>
          <MainLayout>
            <Fragment>{getLayout(<Component {...pageProps} />)}</Fragment>
          </MainLayout>
        </ConfigProvider>
      </Provider>
    </NextIntlClientProvider>
  );
}

export default App;

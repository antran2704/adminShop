import "~/styles/globals.scss";
import type { AppProps } from "next/app";
import { usePathname } from "next/navigation";
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
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

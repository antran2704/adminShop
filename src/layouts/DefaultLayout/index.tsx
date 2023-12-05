import { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "~/components/Navbar";

interface Props {
  children: JSX.Element;
}

const DefaultLayout: FC<Props> = ({ children }: Props) => {
  return (
    <main className="flex items-start justify-between bg-white">
      <Navbar />
      <ToastContainer
        autoClose={5000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <div className="w-full min-h-screen">{children}</div>
    </main>
  );
};

export default DefaultLayout;

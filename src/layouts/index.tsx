import { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "~/components/Navbar";

interface Props {
  children: JSX.Element;
}

const DefaultLayout: FC<Props> = ({ children }: Props) => {
  return (
    <main>
      <div className="flex items-start justify-between lg:gap-4">
        <Navbar />
        <ToastContainer autoClose={5000} pauseOnFocusLoss={false} pauseOnHover={false}/>
        <div className="w-full bg-white min-h-screen">{children}</div>
      </div>
    </main>
  );
};

export default DefaultLayout;

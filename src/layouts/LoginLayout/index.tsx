import { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: JSX.Element;
}

const LoginLayout: FC<Props> = ({ children }: Props) => {
  return (
    <main className="w-full">
      <ToastContainer
        autoClose={5000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      {children}
    </main>
  );
};

export default LoginLayout;

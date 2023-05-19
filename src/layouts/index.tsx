import { FC } from "react";
import Navbar from "~/components/Navbar";

interface Props {
  children: JSX.Element;
}

const DefaultLayout: FC<Props> = ({ children }: Props) => {
  return (
    <main>
      <div className="flex items-start justify-between gap-10">
        <Navbar />
        <div className="w-full h-screen bg-white overflow-hidden">{children}</div>
      </div>
    </main>
  );
};

export default DefaultLayout;

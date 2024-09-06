import { FC } from "react";

interface Props {
  children: JSX.Element;
}

const LoginLayout: FC<Props> = ({ children }: Props) => {
  return <main className="w-full">{children}</main>;
};

export default LoginLayout;

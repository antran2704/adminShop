import { Fragment } from "react";
import DefaultLayout from "../DefaultLayout";

interface Props {
  children: JSX.Element;
}

const LayoutWithoutHeader = ({ children }: Props) => {
  return (
    <DefaultLayout>
      <Fragment>
        {children}
      </Fragment>
    </DefaultLayout>
  );
};

export default LayoutWithoutHeader;

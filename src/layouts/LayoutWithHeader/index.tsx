import { Fragment } from "react";
import DefaultLayout from "../DefaultLayout";
import Notification from "~/components/Notification";
import { useAppSelector } from "~/store/hooks";

interface Props {
    children: JSX.Element;
  }

const LayoutWithHeader = ({ children }: Props) => {
    const { infor } = useAppSelector((state) => state.user);

  return (
    <DefaultLayout>
      <Fragment>
        {/* {infor._id && <Notification />} */}
        {children}
      </Fragment>
    </DefaultLayout>
  );
};

export default LayoutWithHeader;

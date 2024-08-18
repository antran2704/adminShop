import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { Fragment, memo } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

interface Props extends ButtonProps {
  children?: JSX.Element;
  title?: string;
  className?: string;
}

const BtnDelete = (props: Props) => {
  const { className, title, children, type, ...rest } = props;

  return (
    <Fragment>
      {title && <p className={clsx("text-base pb-2")}>{title}</p>}
      <Button
        size="middle"
        className={clsx(
          "hover:!border-error  hover:!text-error",
          [
            type === "primary" &&
              "border-transparent  !bg-error hover:!bg-error !text-white hover:!text-white",
          ],
          className,
        )}
        icon={<RiDeleteBin6Line className="text-xl" />}
        {...rest}>
        {children}
      </Button>
    </Fragment>
  );
};

export default memo(BtnDelete);

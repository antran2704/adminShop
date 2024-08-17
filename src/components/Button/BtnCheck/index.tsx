import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { memo } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

interface Props extends ButtonProps {
  children?: JSX.Element;
  className?: string;
}

const BtnCheck = (props: Props) => {
  const { className, children, ...rest } = props;

  return (
    <Button
      size="middle"
      className={clsx("hover:!border-success hover:!text-success", className)}
      icon={<FaRegCheckCircle className="text-xl" />}
      {...rest}>
      {children}
    </Button>
  );
};

export default memo(BtnCheck);

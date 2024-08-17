import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { memo } from "react";
import { CiEdit } from "react-icons/ci";

interface Props extends ButtonProps {
  children?: JSX.Element;
  className?: string;
}

const BtnDelete = (props: Props) => {
  const { className, children, ...rest } = props;

  return (
    <Button
      size="middle"
      className={clsx(className)}
      icon={<CiEdit className="text-xl" />}
      {...rest}>
      {children}
    </Button>
  );
};

export default memo(BtnDelete);

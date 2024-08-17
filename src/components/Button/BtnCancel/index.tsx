import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { memo } from "react";
import { MdOutlineCancel } from "react-icons/md";

interface Props extends ButtonProps {
  children?: JSX.Element;
  className?: string;
}

const BtnCancel = (props: Props) => {
  const { className, children, ...rest } = props;

  return (
    <Button
      size="middle"
      className={clsx(className)}
      icon={<MdOutlineCancel className="text-xl" />}
      {...rest}>
      {children}
    </Button>
  );
};

export default memo(BtnCancel);

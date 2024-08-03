import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { memo } from "react";

interface Props extends ButtonProps {
  content?: string;
  className?: string;
}

const ButtonDelete = (props: Props) => {
  const { className, content, ...rest } = props;
  const tCommon = useTranslations("Common");
  return (
    <Button
      size="large"
      type="primary"
      className={clsx("bg-red-500 hover:!bg-red-600 ml-auto", className)}
      {...rest}>
      {content ? content : tCommon("btn.delete")}
    </Button>
  );
};

export default memo(ButtonDelete);

import { Tabs, TabsProps } from "antd";
import clsx from "clsx";
import { memo } from "react";

interface Props extends TabsProps {
  className?: string;
}

const TabsCore = (props: Props) => {
  const { className, ...rest } = props;

  return <Tabs className={clsx("dark:text-white", className)} {...rest} />;
};

export default memo(TabsCore);

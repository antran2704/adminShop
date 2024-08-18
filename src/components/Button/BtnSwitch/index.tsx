import { Switch, SwitchProps } from "antd";
import clsx from "clsx";
import { Fragment, memo } from "react";

interface Props extends SwitchProps {
  title?: string;
}

const BtnSwitch = (props: Props) => {
  const { title, ...rest } = props;

  return (
    <Fragment>
      {title && <p className={clsx("text-base pb-2")}>{title}</p>}
      <Switch {...rest} />
    </Fragment>
  );
};

export default memo(BtnSwitch);

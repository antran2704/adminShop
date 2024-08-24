import { Input, InputProps, InputRef } from "antd";
import clsx from "clsx";
import { forwardRef, Fragment, Ref } from "react";

interface Props extends InputProps {
  title?: string;
  error?: boolean;
}

const InputText = (props: Props, ref: Ref<InputRef>) => {
  const { title, error, ...rest } = props;

  return (
    <Fragment>
      {title && (
        <p className={clsx("text-base pb-2 dark:text-darkInput")}>{title}</p>
      )}
      <Input ref={ref} size="large" {...rest} status={error ? "error" : ""} />
    </Fragment>
  );
};

export default forwardRef(InputText);

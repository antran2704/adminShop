import { Input, InputProps, InputRef } from "antd";
import clsx from "clsx";
import { forwardRef, Ref } from "react";

interface Props extends InputProps {
  title?: string;
  error?: boolean;
}

const InputText = (props: Props, ref: Ref<InputRef>) => {
  const { title, error, ...rest } = props;

  return (
    <div>
      {title && (
        <p
          className={clsx("md:text-lg text-base pb-2", [
            error && "text-error",
          ])}>
          {title}
        </p>
      )}
      <Input ref={ref} size="large" {...rest} status={error ? "error" : ""} />
    </div>
  );
};

export default forwardRef(InputText);

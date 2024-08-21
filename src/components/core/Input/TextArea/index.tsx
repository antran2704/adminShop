import { Input, InputRef } from "antd";
import { TextAreaProps } from "antd/es/input";
import clsx from "clsx";
import { forwardRef, Ref } from "react";

interface Props extends TextAreaProps {
  title?: string;
  error?: boolean;
}

const InputText = (props: Props, ref: Ref<InputRef>) => {
  const { title, error, ...rest } = props;

  return (
    <div>
      {title && (
        <p
          className={clsx("text-base pb-2 dark:text-darkInput", [
            error && "text-error",
          ])}>
          {title}
        </p>
      )}
      <Input.TextArea
        ref={ref}
        size="large"
        {...rest}
        status={error ? "error" : ""}
      />
    </div>
  );
};

export default forwardRef(InputText);

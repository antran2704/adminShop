import { Input, InputProps } from "antd";
import clsx from "clsx";
import { forwardRef, Fragment } from "react";
import { revertBigNumberToString } from "~/helper/format/number";

interface Props extends InputProps {
  title?: string;
  error?: boolean;
  maximum?: number;
  onChangeValue?: (value: number) => void;
}

const InputNumber = (props: Props, ref: any) => {
  const { title, error = false, maximum, onChangeValue, ...rest } = props;

  const onChange = (value: string) => {
    const validValue = Number(revertBigNumberToString(value));

    if (isNaN(validValue)) return;

    if (onChangeValue && maximum && validValue > maximum) {
      onChangeValue(maximum);
      return;
    }

    if (onChangeValue) onChangeValue(validValue);
  };

  return (
    <Fragment>
      {title && (
        <p className={clsx("text-base pb-2 dark:text-darkInput")}>{title}</p>
      )}
      <Input
        ref={ref}
        {...rest}
        size="large"
        status={error ? "error" : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </Fragment>
  );
};

export default forwardRef(InputNumber);

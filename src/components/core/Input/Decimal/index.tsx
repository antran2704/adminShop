import { Input, InputProps } from "antd";
import clsx from "clsx";
import { forwardRef, Fragment } from "react";
import { revertBigNumberToString } from "~/helper/format/number";

interface Props extends InputProps {
  title?: string;
  maximum?: number;
  error?: boolean;
  onChangeValue?: (value: string) => void;
}

const InputDecimal = (props: Props, ref: any) => {
  const { title, maximum, error = false, onChangeValue, ...rest } = props;

  const onChange = (value: string) => {
    if (value === "" && onChangeValue) onChangeValue(value);
    const isDecimal = value.match(/^-?\d*\.?\d+$/);
    const validValue = Number(revertBigNumberToString(value));

    if (!isDecimal || isNaN(validValue) || validValue < 0) return;

    if (onChangeValue && maximum && Number(value) > maximum) {
      onChangeValue(maximum.toString());
      return;
    }

    if (onChangeValue) onChangeValue(value);
  };

  return (
    <Fragment>
      {title && (
        <p className={clsx("text-base pb-2 dark:text-darkInput")}>{title}</p>
      )}
      <Input
        type="number"
        status={error ? "error" : ""}
        ref={ref}
        {...rest}
        size="large"
        onChange={(e) => onChange(e.target.value)}
      />
    </Fragment>
  );
};

export default forwardRef(InputDecimal);

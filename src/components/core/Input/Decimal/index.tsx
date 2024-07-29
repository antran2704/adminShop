import { Input, InputProps } from "antd";
import { forwardRef } from "react";
import { revertBigNumberToString } from "~/helper/format/number";

interface Props extends InputProps {
  maximum?: number;
  onChangeValue?: (value: string) => void;
}

const InputDecimal = (props: Props, ref: any) => {
  const { maximum, onChangeValue, ...rest } = props;

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
    <Input
      type="number"
      ref={ref}
      {...rest}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default forwardRef(InputDecimal);

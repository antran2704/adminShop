import { Input, InputProps } from "antd";
import { forwardRef } from "react";
import { revertBigNumberToString } from "~/helper/format/number";

interface Props extends InputProps {
  onChangeValue?: (value: number) => void;
}

const InputNumber = (props: Props, ref: any) => {
  const { onChangeValue, ...rest } = props;

  const onChange = (value: string) => {
    const validValue = Number(revertBigNumberToString(value));

    if (isNaN(validValue)) return;

    if (onChangeValue) onChangeValue(validValue);
  };

  return (
    <Input ref={ref} {...rest} onChange={(e) => onChange(e.target.value)} />
  );
};

export default forwardRef(InputNumber);

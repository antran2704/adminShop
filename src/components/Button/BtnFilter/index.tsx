import { Button, ButtonProps } from "antd";
import { useTranslations } from "next-intl";
import { IoFilterOutline } from "react-icons/io5";

interface Props extends ButtonProps {}

const BtnFilter = (props: Props) => {
  const tCommon = useTranslations("Common");

  return (
    <Button
      className="!flex items-center"
      icon={<IoFilterOutline className="text-2xl" />}
      {...props}>
      {tCommon("filter.title")}
    </Button>
  );
};

export default BtnFilter;

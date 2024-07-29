import { Button, ButtonProps } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

interface Props extends ButtonProps {}

const BtnExcel = (props: Props) => {
  const tCommon = useTranslations("Common");
  return (
    <Button
      className="!flex items-center"
      icon={<DownloadOutlined />}
      {...props}>
      {tCommon("exportExcel")}
    </Button>
  );
};

export default BtnExcel;

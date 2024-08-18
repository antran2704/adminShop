import { Button, ButtonProps } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

interface Props {
  beforeEl?: JSX.Element;
  afterEl?: JSX.Element;
  okText?: string;
  okProps?: ButtonProps;
  cancelProps?: ButtonProps;
  cancelText?: string;
  okElement?: ReactNode;
  cancelElement?: ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
}

const FormFooter = (props: Props) => {
  const {
    beforeEl,
    afterEl,
    okText,
    okElement,
    cancelElement,
    cancelText,
    okProps,
    cancelProps,
    onCancel,
    onOk,
  } = props;
  const tCommon = useTranslations("Common");

  return (
    <div className="sticky bottom-0 flex items-center justify-end py-4 px-5 -mx-5 mt-5 bg-white/60 backdrop-blur-md border-t gap-5 z-20">
      {beforeEl}

      {!cancelElement ? (
        <Button
          size="large"
          type="primary"
          {...cancelProps}
          onClick={onCancel}
          className={clsx(
            "min-w-[100px] w-fit text-lg text-white font-medium bg-[#111926] hover:!bg-[#111926] px-5 py-1 opacity-90 hover:opacity-100 rounded-md",
            cancelProps?.className,
            [cancelElement === null && "hidden"],
          )}>
          {cancelText ? cancelText : tCommon("btn.back")}
        </Button>
      ) : (
        cancelElement
      )}

      {!okElement ? (
        <Button
          size="large"
          type="default"
          {...okProps}
          onClick={onOk}
          className={clsx(
            "min-w-[100px] w-fit text-lg text-primary hover:!text-white font-medium hover:!bg-primary px-5 py-1 opacity-90 hover:opacity-100 border-primary rounded-md",
            okProps?.className,
            [okElement === null && "hidden"],
          )}>
          {okText ? okText : tCommon("btn.create")}
        </Button>
      ) : (
        okElement
      )}

      {afterEl}
    </div>
  );
};

export default FormFooter;

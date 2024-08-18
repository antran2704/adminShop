import { ButtonProps, Modal, ModalProps } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { BiSolidError } from "react-icons/bi";
import { FaInfoCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";

interface Props extends ModalProps {
  title: string;
  subtitle?: string;
  type: "info" | "danger" | "error";
  description?: string;
  children?: React.ReactNode;
}

const ModalConfirm = (props: Props) => {
  const {
    title,
    subtitle,
    type = "danger",
    description,
    children,
    okButtonProps,
    cancelButtonProps,
    ...prop
  } = props;

  const tCommon = useTranslations("Common");

  return (
    <Modal
      centered
      title={
        <div className="flex items-start justify-start gap-4">
          <div className="flex items-center justify-center rounded-full">
            {type === "danger" && (
              <BiSolidError className="text-3xl text-[#F0A328]" />
            )}
            {type === "info" && (
              <FaInfoCircle className="text-3xl text-primary" />
            )}
            {type === "error" && (
              <MdOutlineError className="text-3xl text-red-500" />
            )}
          </div>
          <div className="w-full">
            <p className="text-lg ">{title}</p>
            {subtitle && <p className="text-base font-normal">{subtitle}</p>}
            {description && (
              <p className="text-base font-normal italic py-2">{description}</p>
            )}
          </div>
        </div>
      }
      cancelButtonProps={{
        size: "large",
        ...cancelButtonProps,
        className: clsx("md:w-[100px] w-1/2"),
      }}
      okButtonProps={{
        size: "large",
        ...okButtonProps,
        className: clsx(
          "md:w-[100px] w-1/2",
          [type === "danger" && "!bg-[#F0A328] hover:!bg-[#F0A328]"],
          [type === "info" && "bg-primary hover:!bg-primary"],
          [type === "error" && "bg-red-500 hover:!bg-red-500"],
          okButtonProps?.className,
        ),
      }}
      okText={tCommon("btn.confirm")}
      cancelText={tCommon("btn.back")}
      {...prop}>
      {children}
    </Modal>
  );
};

export default ModalConfirm;

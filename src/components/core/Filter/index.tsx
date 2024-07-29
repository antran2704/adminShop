import { Button, Modal, ModalProps } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { IoMdClose } from "react-icons/io";

import { BtnFilter } from "~/components/Button";

interface Props extends ModalProps {
  filter: any;
  children: JSX.Element;
  onClearFilter: () => void;
  onFilter: () => void;
}

const FilterCore = (props: Props) => {
  const { filter, children, onClearFilter, onFilter, ...rest } = props;

  const tFilter = useTranslations("Common.filter");
  const tCommon = useTranslations("Common");

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const onShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleClearFilter = () => {
    onClearFilter();
    setShowFilter(false);
  };

  const handleFilter = () => {
    onFilter();
    setShowFilter(false);
  };

  return (
    <Fragment>
      <BtnFilter onClick={onShowFilter} type="primary" size="large" />
      <Modal
        {...rest}
        centered={true}
        open={showFilter}
        onCancel={onShowFilter}
        destroyOnClose={true}
        closeIcon={false}
        footer={null}>
        <div className="flex flex-col gap-4">{children}</div>
        <div className="sticky bottom-0 w-full flex item justify-between bg-white/60 backdrop-blur-sm py-5 border-t">
          {!!Object.keys(filter).length && (
            <Button
              icon={<IoMdClose />}
              size="large"
              type="text"
              onClick={handleClearFilter}
              className="!flex items-center md:w-fit gap-2">
              {tFilter("cancel")}
            </Button>
          )}
          <div className="flex items-center justify-end ml-auto gap-2">
            <Button
              onClick={onShowFilter}
              size="large"
              className="md:w-[100px] w-full">
              {tCommon("goBack")}
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={handleFilter}
              className={clsx("md:w-[100px] w-full")}>
              {tFilter("apply")}
            </Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default FilterCore;

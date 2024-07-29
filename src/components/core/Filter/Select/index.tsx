import { forwardRef, MouseEvent } from "react";
import { Select, SelectProps, Tag } from "antd";
import { IoIosCloseCircle } from "react-icons/io";
import clsx from "clsx";

interface Props extends SelectProps {
  title?: string;
  borderBottom?: boolean;
  scrollVitual?: boolean;
  onScrollVitual?: () => void;
}

type TagRender = SelectProps["tagRender"];

const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={"#F0F5FF"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      closeIcon={<IoIosCloseCircle className="size-4 min-w-4" />}
      onClose={onClose}
      className="flex items-center text-sm !text-[#3784FB] px-4 py-1 my-1 rounded-xl gap-2">
      {label}
    </Tag>
  );
};

const SelectFilter = (props: Props, ref: any) => {
  const { title, borderBottom, scrollVitual, onScrollVitual, ...rest } = props;

  const handleScroll = (e: MouseEvent<HTMLDivElement>) => {
    if (!onScrollVitual || !scrollVitual) return;

    const element = e.currentTarget;
    const clientHeight = element.clientHeight;
    const scrollTop = element.scrollTop;

    if (clientHeight + scrollTop + 1 >= element.scrollHeight) {
      onScrollVitual();
    }
  };

  return (
    <div
      className={clsx("w-full flex flex-col gap-2", {
        "pb-4 border-b border-b-neutral-200": borderBottom,
      })}>
      {title && <p className="text-base font-medium">{title}</p>}
      <Select
        size="large"
        ref={ref}
        {...rest}
        tagRender={tagRender}
        onPopupScroll={handleScroll}
      />
    </div>
  );
};

export default forwardRef(SelectFilter);

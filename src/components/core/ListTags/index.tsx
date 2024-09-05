import { Fragment, memo, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import { Input, Tag } from "antd";
import clsx from "clsx";

interface Props {
  data?: string[];
  disabled?: boolean;
  title?: string;
  error?: boolean;
  onChange?: (tags: string[]) => void;
}

const ListTag = (props: Props) => {
  const { data = [], disabled = false, title, error = false, onChange } = props;

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<InputRef>(null);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);

    if (onChange) {
      onChange(newTags);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);

      if (onChange) {
        onChange([...tags, inputValue]);
      }
    }

    setInputValue("");
  };

  useEffect(() => {
    if (data.length && !tags.length) {
      setTags(data);
    }
  }, [data]);

  return (
    <Fragment>
      {title && (
        <p className={clsx("text-base pb-2 dark:text-darkInput")}>{title}</p>
      )}
      <div className="w-full min-h-10 flex items-center flex-wrap p-2 border rounded-md gap-2">
        {tags.map((tag: string) => (
          <span key={tag} style={{ display: "inline-block" }}>
            <Tag
              closable={!disabled}
              onClose={(e) => {
                e.preventDefault();
                handleClose(tag);
              }}
              className="flex items-center text-sm !text-[#3784FB] px-4 py-1 my-1 rounded-xl gap-2">
              {tag}
            </Tag>
          </span>
        ))}

        {!disabled && (
          <Input
            ref={inputRef}
            type="text"
            size="middle"
            value={inputValue}
            placeholder="Please enter tag..."
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
            className="!flex-1 min-w-[100px]"
          />
        )}
      </div>
    </Fragment>
  );
};

export default memo(ListTag);

"use client";

import { Fragment, forwardRef, useEffect, useState } from "react";
import { Upload, UploadProps, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  UploadChangeParam,
  UploadFile as UploadFileType,
} from "antd/es/upload";

import { FileType } from "~/interface";

import clsx from "clsx";
import { ETypeFile } from "~/enums/file";
import { checkFile } from "~/helper/file";
import { messageFile } from "~/common/file";

interface Props {
  data: UploadFileType[];
  maxFile?: number;
  multiple?: boolean;
  disable?: boolean;
  rules?: ETypeFile[];
  onChangeFile?: (file: UploadFileType[] | UploadFileType | null) => void;
  onRemoveFile?: (file: UploadFileType | null) => void;
  ref: any;
}
const UploadFile = (
  {
    onChangeFile,
    data,
    maxFile,
    multiple = false,
    disable = false,
    rules = [],
    onRemoveFile,
  }: Props,
  ref: any,
) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFileType[]>([]);

  const handleRemove = (file: UploadFileType) => {
    const newFileList: UploadFileType[] = fileList.filter(
      (item: UploadFileType) => item.uid !== file.uid,
    );
    setFileList(newFileList);

    if (onRemoveFile && multiple) {
      onRemoveFile(file);
    }

    if (onRemoveFile && !multiple) {
      onRemoveFile(null);
    }
  };

  const handleChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFileType>,
  ) => {
    if (!info.file || info.file.status === "removed") return;

    if (maxFile && fileList.length >= maxFile) return;

    const isValid = !!rules.length
      ? checkFile(info.file as FileType, rules)
      : true;

    if (!isValid) {
      messageApi.error(
        `You can upload only document like ${rules
          .map((rule: ETypeFile) => messageFile[rule])
          .join("/")}`,
      );
      return;
    }

    // update link for new file
    const newFileList = [...fileList];

    newFileList.push({
      uid: info.file.uid,
      lastModified: info.file.lastModified,
      lastModifiedDate: info.file.lastModifiedDate,
      name: info.file.name,
      size: info.file.size,
      type: info.file.type,
      url: URL.createObjectURL(info.file as any),
    });

    setFileList(newFileList);

    if (onChangeFile && multiple) {
      onChangeFile(info.fileList);
    }

    if (onChangeFile && !multiple) {
      onChangeFile(info.fileList[0]);
    }
  };

  useEffect(() => {
    setFileList(data);
  }, []);

  return (
    <Fragment>
      <Upload
        disabled={disable}
        multiple={multiple}
        beforeUpload={() => false}
        onRemove={(file: UploadFileType) => handleRemove(file)}
        onChange={handleChange}
        listType="picture"
        maxCount={maxFile}
        className="w-full h-full"
        fileList={fileList}
        ref={ref}>
        {!disable && multiple && (
          <button
            className={clsx(
              "flex flex-col items-center justify-center px-6 py-3 border hover:border-primary-200 hover:text-primary-200 border-dashed rounded-lg transition-all ease-linear duration-100 gap-2",
              [maxFile && fileList.length >= maxFile && "hidden"],
            )}>
            <UploadOutlined />
            Upload
          </button>
        )}

        {!disable && !multiple && !fileList.length && (
          <button
            className={clsx(
              "flex flex-col items-center justify-center px-6 py-3 border hover:border-primary-200 hover:text-primary-200 border-dashed rounded-lg transition-all ease-linear duration-100 gap-2",
            )}>
            <UploadOutlined />
            Upload
          </button>
        )}
      </Upload>
      {contextHolder}
    </Fragment>
  );
};

export default forwardRef(UploadFile);

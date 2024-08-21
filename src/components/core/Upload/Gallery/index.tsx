import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import clsx from "clsx";
import { ETypeFile } from "~/enums/file";
import { UploadChangeParam } from "antd/es/upload";
import { checkFile } from "~/helper/file";
import { FileType } from "~/interface";

interface Props {
  data: UploadFile[];
  maxFile?: number;
  disable?: boolean;
  error?: boolean;
  rules?: ETypeFile[];
  fileSize?: number;
  className?: string;
  title?: string;
  onChangeFile?: (file: UploadFile | null) => void;
  onRemoveFile?: (file: UploadFile | null) => void;
}

const UploadGallery = ({
  onChangeFile,
  data,
  maxFile,
  fileSize = 2, //MB
  disable = false,
  error,
  rules = [],
  className,
  title,
  onRemoveFile,
}: Props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList: UploadFile[] = fileList.filter(
      (item: UploadFile) => item.uid !== file.uid,
    );
    setFileList(newFileList);

    if (onRemoveFile) {
      onRemoveFile(file);
    }
  };

  const handleChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (!info.file || info.file.status === "removed") return;

    if (maxFile && fileList.length >= maxFile) return;

    const isValid: boolean = checkFile(info.file as FileType, rules, fileSize);

    if (!isValid) return;

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

    if (onChangeFile) {
      onChangeFile(info.file);
    }
  };

  useEffect(() => {
    setFileList(data);
  }, []);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <div className={clsx("w-full h-full", className)}>
      {title && (
        <p
          className={clsx("text-base pb-2 dark:text-darkInput", [
            error && "text-error",
          ])}>
          {title}
        </p>
      )}
      <Upload
        listType="picture-card"
        rootClassName={clsx("gallery relative w-full h-full", [
          maxFile && fileList.length >= maxFile && "disabled",
        ])}
        fileList={fileList}
        beforeUpload={() => false}
        onPreview={handlePreview}
        disabled={disable}
        onRemove={handleRemove}
        onChange={handleChange}>
        {maxFile && fileList.length >= maxFile ? null : uploadButton}
      </Upload>
      {previewImage && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default UploadGallery;

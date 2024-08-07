import { message } from "antd";
import { messageFile } from "~/common/file";
import { ETypeFile } from "~/enums/file";
import { FileType } from "~/interface";

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const checkFile = (
  file: FileType,
  rules: ETypeFile[],
  fileSize: number = 2,
) => {
  const isValidFile: boolean = !!rules.length
    ? rules.includes(file.type as ETypeFile)
    : true;

  if (!isValidFile) {
    message.error(
      `You can only upload ${rules
        .map((rule: ETypeFile) => messageFile[rule])
        .join("/")} file!`,
    );
    return false;
  }

  const isValidFileSize = file.size / 1024 / 1024 < fileSize;
  if (!isValidFileSize) {
    message.error(`File must smaller than ${fileSize}MB!`);
  }
  return isValidFile && isValidFileSize;
};

export { checkFile, getBase64 };

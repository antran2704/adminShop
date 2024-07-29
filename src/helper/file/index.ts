import { message } from "antd";
import { messageFile } from "~/common/file";
import { ETypeFile } from "~/enums/file";
import { FileType } from "~/interface";

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const checkImage = (
  file: FileType,
  rules: ETypeFile[],
  fileSize: number = 2,
) => {
  const isJpgOrPng: boolean = !!rules.length
    ? rules.includes(file.type as ETypeFile)
    : true;

  if (!isJpgOrPng) {
    message.error(
      `You can only upload ${rules
        .map((rule: ETypeFile) => messageFile[rule])
        .join("/")} file!`,
    );
  }

  const isFileSizeValid = file.size / 1024 / 1024 < fileSize;
  if (!isFileSizeValid) {
    message.error(`Image must smaller than ${fileSize}MB!`);
  }
  return isJpgOrPng && isFileSizeValid;
};

const checkFile = (file: FileType, rules: ETypeFile[]) => {
  const isValid = rules.includes(file.type as ETypeFile);
  return isValid;
};

export { checkFile, checkImage, getBase64 };

import { ECompressFormat, ETypeImage } from "~/enums";

interface IThumbnail {
  source: FileList | {};
  urlBase64: string;
}

interface IOptionImage {
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
  quality: number;
  type: ETypeImage;
  compressFormat: ECompressFormat;
}

export type { IThumbnail, IOptionImage };

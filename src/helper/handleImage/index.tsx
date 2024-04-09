import axios from "axios";
import Resizer from "react-image-file-resizer";
import { IOptionImage, IThumbnail } from "~/interface/image";
import { axiosPost } from "~/ultils/configAxios";

const uploadImage = (el: Element) => {
  const target = el as HTMLInputElement;
  const files: FileList | null = target.files;
  const url: string = URL.createObjectURL(files?.[0] as File);

  return url;
};

const uploadImageOnServer = async (url: string, formData: FormData) => {
  const payload = await axiosPost(url, formData);
  return payload;
};

const uploadGalleryOnServer = async (url: string, formData: FormData) => {
  const payload = await axios.post(url, formData).then((res) => res.data);
  return payload;
};

const deleteImageInSever = async (filePath: string) => {
  const payload = await axios
    .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/delete`, { filePath })
    .then((res) => res.data);
  return payload;
};

const deleteImagesInServer = async (images: IThumbnail[]) => {
  const list = images.map((image: IThumbnail) => {
    return { filePath: image.urlBase64 };
  });

  const payload = await axios
    .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/delete/images`, {
      images: list,
    })
    .then((res) => res.data);
  return payload;
};

const deleteGallery = (index: number, gallery: IThumbnail[]) => {
  gallery.splice(index, 1);
  return gallery;
};

const resizeImage = (
  file: File,
  option: IOptionImage
) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      option.maxWidth,
      option.maxHeight,
      option.compressFormat,
      option.quality,
      0,
      (uri) => {
        resolve(uri);
      },
      option.type,
      option.minWidth,
      option.minHeight
    );
  });
};

export {
  uploadImage,
  deleteGallery,
  deleteImageInSever,
  deleteImagesInServer,
  uploadImageOnServer,
  uploadGalleryOnServer,
  resizeImage,
};

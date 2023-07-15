import axios from "axios";
import { IThumbnail } from "~/interface/image";

const uploadImage = (el: Element) => {
  const target = el as HTMLInputElement;
  const files: FileList | null = target.files;
  const url: string = URL.createObjectURL(files?.[0] as File);

  return url;
};

const uploadImageOnServer = async (url: string, formData: FormData) => {
  try {
    const payload = await axios.post(url, formData).then((res) => res.data);
    return payload;
  } catch (error) {
    console.log(error);
  }
};

const uploadGalleryOnServer = async (url: string, formData: FormData) => {
  try {
    const payload = await axios.post(url, formData).then((res) => res.data);
    console.log(payload);
    return payload;
  } catch (error) {
    console.log(error);
  }
};

const deleteImageInSever = async (filePath: string) => {
  try {
    const payload = await axios
      .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/delete`, { filePath })
      .then((res) => res.data);
    return payload;
  } catch (error) {
    console.log(error);
  }
};

const deleteImagesInServer = async (images: IThumbnail[]) => {
  const list = images.map((image: IThumbnail) => {
    return { filePath: image.urlBase64 };
  });

  try {
    const payload = await axios
      .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/delete`, { images: list })
      .then((res) => res.data);
    return payload;
  } catch (error) {
    console.log(error);
  }
};

const deleteGallery = (index: number, gallery: IThumbnail[]) => {
  gallery.splice(index, 1);
  return gallery;
};

export {
  uploadImage,
  deleteGallery,
  deleteImageInSever,
  deleteImagesInServer,
  uploadImageOnServer,
  uploadGalleryOnServer,
};

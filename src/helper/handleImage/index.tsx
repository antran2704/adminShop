import axios from "axios";
import { IThumbnail } from "~/interface/image";

const uploadImage = (el: Element) => {
  const target = el as HTMLInputElement;
  const files: FileList | null = target.files;
  const url: string = URL.createObjectURL(files?.[0] as File);

  return url;
};

const deleteImageInSever = async (filePath: string) => {
  const path = filePath.replace("http://localhost:3001/", "./");
  try {
    const payload = await axios
      .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/delete`, { path })
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

export { uploadImage, deleteGallery, deleteImageInSever };

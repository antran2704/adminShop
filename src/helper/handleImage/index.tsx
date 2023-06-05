const uploadImage = (el: Element) => {
  const target = el as HTMLInputElement;
  const files: FileList | null = target.files;
  const url: string = URL.createObjectURL(files?.[0] as File);

  return url;
};

const deleteGallery = (index: number, gallery: string[]) => {
  gallery.splice(index, 1);

  return gallery;
};

export { uploadImage, deleteGallery };

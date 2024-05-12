import { FC, ChangeEvent, memo, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import ImageCus from "./ImageCus";
import { IOptionImage } from "~/interface";
import { ECompressFormat, ETypeImage } from "~/enums";
import { checkImage, resizeImage } from "~/helper/handleImage";

interface Props {
  gallery: string[];
  limited?: number;
  loading: boolean;
  error?: boolean;
  className?: string;
  option?: IOptionImage;
  onChange: (source: File) => void;
  onDelete: (url: string) => void;
}

const initOption: IOptionImage = {
  quality: 100,
  maxHeight: 400,
  maxWidth: 400,
  minHeight: 200,
  minWidth: 200,
  type: ETypeImage.file,
  compressFormat: ECompressFormat.WEBP,
};

const Gallery: FC<Props> = (props: Props) => {
  const {
    gallery,
    limited = 1,
    className = "w-[120px] h-[120px]",
    loading,
    error,
    option = initOption,
    onChange,
    onDelete,
  } = props;

  const [selectImage, setSelect] = useState<string | null>(null);

  const hanldeChangeGallery = async (e: ChangeEvent<HTMLInputElement>) => {
   
    if (e.target.files) {
      const file = e.target.files[0];
      const isValidImage: boolean = checkImage(file, 500000);

      if (!isValidImage) return;
      
      const newImage = (await resizeImage(file, option)) as File;
      const source: File = newImage;
      onChange(source);
    }
  };

  return (
    <div className="w-full">
      <span className="block text-base text-[#1E1E1E] dark:text-darkText font-medium mb-1">
        Gallery
      </span>

      <ul className="flex flex-wrap mt-4 gap-3">
        {gallery.map((url: string, index: number) => (
          <li
            key={index}
            className={`relative ${className ? className : ""} ${
              selectImage === url
                ? "opacity-90 pointer-events-none"
                : "pointer-events-auto"
            } rounded-md overflow-hidden`}
          >
            <div
              onClick={() => {
                setSelect(url);
                onDelete(url);
              }}
              className=" opacity-0 hover:opacity-100 cursor-pointer transition-all ease-linear duration-100"
            >
              <div className="absolute w-full h-full bg-black opacity-40 z-[1]"></div>
              <div className="absolute flex items-center justify-center w-full h-full text-2xl font-bold text-white z-[2]">
                <AiFillCloseCircle />
              </div>
            </div>

            <ImageCus
              src={process.env.NEXT_PUBLIC_ENDPOINT_API + url}
              className="w-full h-full"
            />
          </li>
        ))}

        {gallery.length < limited && (
          <label
            htmlFor="gallery"
            className={`flex flex-col items-center justify-center ${
              error ? "border-error" : ""
            } ${
              className ? className : ""
            } rounded-md border-2 border-dashed cursor-pointer overflow-hidden`}
          >
            {!loading && (
              <p className="text-sm font-medium text-center dark:text-darkText">
                {gallery.length} / {limited}
              </p>
            )}

            {loading && (
              <p className="text-sm font-medium text-center dark:text-darkText">
                Loading...
              </p>
            )}
            <input
              onChange={hanldeChangeGallery}
              disabled={loading}
              type="file"
              id="gallery"
              className="hidden"
              multiple
              name="gallery"
            />
          </label>
        )}
      </ul>
    </div>
  );
};

export default memo(Gallery);

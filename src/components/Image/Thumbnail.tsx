import { FC, ChangeEvent, memo } from "react";
import { IoAdd } from "react-icons/io5";
import { toast } from "react-toastify";
import { resizeImage, uploadImage } from "~/helper/handleImage";
import ImageCus from "./ImageCus";
import { IOptionImage } from "~/interface";
import { ECompressFormat, ETypeImage } from "~/enums";
import { useTranslation } from "react-i18next";

interface Props {
  url: string | null;
  title?: string;
  option?: IOptionImage;
  className?: string;
  error?: boolean;
  loading: boolean;
  onChange: (source: File, urlBase64?: string) => void;
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

const Thumbnail: FC<Props> = (props: Props) => {
  const {
    url,
    title = "Thumbnail",
    className,
    loading,
    option = initOption,
    error,
    onChange,
  } = props;

  const { t } = useTranslation();

  const hanldeChangeThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file && /^image\//.test(file.type)) {
        if (file.size > 500000) {
          toast.error("File size is larger than 500000 bytes", {
            position: toast.POSITION.TOP_RIGHT,
          });

          return;
        }

        const newImage = (await resizeImage(file, option)) as File;
        const source: File = newImage;
        const url: string = uploadImage(e.target);
        onChange(source, url);
      } else {
        toast.error("Only upload file type image", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  return (
    <div className="w-full">
      <span
        id="thumbnail"
        className="block text-base text-[#1E1E1E] dark:text-darkText font-medium mb-1"
      >
        {title}
      </span>

      <label
        htmlFor="thumbnail_input"
        className={`flex flex-col items-center justify-center w-full ${
          error ? "border-error" : ""
        } ${
          className
            ? className
            : "lg:min-h-[400px] md:min-h-[300px] min-h-[200px] max-h-[600px]"
        } rounded-md ${
          !url ? "border-2 border-dashed" : ""
        } cursor-pointer overflow-hidden`}
      >
        {loading && (
          <p className="text-base font-medium text-center dark:text-darkText">
            {t("Thumbnail.loading")}...
          </p>
        )}
        {!url && !loading && (
          <>
            <IoAdd className="md:text-6xl text-4xl dark:text-darkText" />
            <p className="text-base font-medium text-center dark:text-darkText">
              {t("Thumbnail.upload")}
            </p>
          </>
        )}
        {url && !loading && (
          <ImageCus
            src={process.env.NEXT_PUBLIC_ENDPOINT_API + url}
            title="Thumbanil"
            className="w-full h-full object-contain object-center"
          />
        )}
        <input
          onChange={hanldeChangeThumbnail}
          disabled={loading}
          type="file"
          id="thumbnail_input"
          name="thumbnail_input"
          className="hidden"
        />
      </label>

      {/* <CropImage /> */}
    </div>
  );
};

export default memo(Thumbnail);

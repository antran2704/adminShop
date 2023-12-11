import { FC, ChangeEvent, memo } from "react";
import { IoAdd } from "react-icons/io5";
import { toast } from "react-toastify";
import { uploadImage } from "~/helper/handleImage";
import ImageCus from "./ImageCus";

interface Props {
  url: string | null;
  className?: string;
  error?: boolean;
  loading: boolean;
  onChange: (source: File, urlBase64?: string) => void;
}

const Thumbnail: FC<Props> = (props: Props) => {
  const { url, className, loading, error, onChange } = props;

  const hanldeChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file && /^image\//.test(file.type)) {
        if (file.size > 500000) {
          toast.error("File size is larger than 500000 bytes", {
            position: toast.POSITION.TOP_RIGHT,
          });

          return;
        }

        const source: File = file;
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
    <div className="lg:w-1/2 w-full">
      <span
        id="thumbnail"
        className="block text-base text-[#1E1E1E] font-medium mb-1"
      >
        Thumbnail
      </span>

      <label
        htmlFor="thumbnail_input"
        className={`flex flex-col items-center justify-center w-full ${
          error ? "border-error" : ""
        } ${
          className ? className : "min-h-[100px] min-w-[100px] max-h-[400px] max-w-[400px]"
        } rounded-md border-2 ${!url ? 'border-dashed' : ""} cursor-pointer overflow-hidden`}
      >
        {loading && (
          <p className="text-base font-medium text-center">Loading...</p>
        )}
        {!url && !loading && (
          <>
            <IoAdd className="md:text-6xl text-4xl" />
            <p className="text-base font-medium text-center">Click to upload</p>
          </>
        )}
        {url && !loading && (
          <ImageCus src={url} title="Thumbanil" className="w-full h-full object-contain object-center" />
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
    </div>
  );
};

export default memo(Thumbnail);

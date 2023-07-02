import { FC, ChangeEvent, memo } from "react";
import { IoAdd } from "react-icons/io5";
import { uploadImage } from "~/helper/handleImage";

interface prop {
  thumbnailUrl: string | null;
  onChange: (source: File, urlBase64: string) => void;
}

const Thumbnail: FC<prop> = (prop: prop) => {
  const hanldeChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (/^image\//.test(file.type)) {
        const source: File = file;
        const url: string = uploadImage(e.target);
        prop.onChange(source, url);
      }
    }
  };
  return (
    <div className="lg:w-1/2 w-full">
      <span className="block text-base text-[#1E1E1E] font-medium mb-1">
        Thumbnail
      </span>

      <label
        htmlFor="thumbnail"
        className="flex flex-col items-center justify-center w-full h-[300px] rounded-md border-2 cursor-pointer overflow-hidden"
      >
        {!prop.thumbnailUrl && (
          <>
            <IoAdd className="md:text-6xl text-4xl" />
            <h3 className="text-lg font-medium text-center">Click to upload</h3>
          </>
        )}
        {prop.thumbnailUrl && (
          <img
            src={prop.thumbnailUrl}
            alt="thumbnail"
            className="w-full h-full"
          />
        )}
        <input
          onChange={hanldeChangeThumbnail}
          type="file"
          id="thumbnail"
          name="thumbnail"
          className="hidden"
        />
      </label>
    </div>
  );
};

export default memo(Thumbnail);

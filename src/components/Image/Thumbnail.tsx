import { FC, ChangeEvent } from "react";
import { IoAdd } from "react-icons/io5";

interface prop {
    thumbnailUrl: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Thumbnail: FC<prop> = (prop: prop) => {
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
          <img src={prop.thumbnailUrl} alt="thumbnail" className="w-full h-full" />
        )}
        <input
          onChange={prop.onChange}
          type="file"
          id="thumbnail"
          className="hidden"
        />
      </label>
    </div>
  );
};

export default Thumbnail;

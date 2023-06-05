import { FC, ChangeEvent } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";

interface prop {
  gallery: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (index: number) => void;
}

const Gallery: FC<prop> = (prop: prop) => {
  return (
    <div className="lg:w-1/2 w-full">
      <span className="block text-base text-[#1E1E1E] font-medium mb-1">
        Gallery
      </span>

      <label
        htmlFor="gallery"
        className="flex flex-col items-center justify-center w-full h-[300px] rounded-md border-2 cursor-pointer overflow-hidden"
      >
        <IoAdd className="md:text-6xl text-4xl" />
        <h3 className="text-lg font-medium text-center">Click to upload</h3>
        <input
          onChange={prop.onChange}
          type="file"
          id="gallery"
          className="hidden"
        />
      </label>

      <ul className="grid flex-wrap grid-cols-3 mt-4 gap-3">
        {prop.gallery.map((url: string, index: number) => (
          <li key={index} className="relative rounded-md overflow-hidden">
            <div
              onClick={() => prop.onDelete(index)}
              className=" opacity-0 hover:opacity-100 cursor-pointer transition-all ease-linear duration-100"
            >
              <div className="absolute w-full h-full bg-black opacity-40 z-[1]"></div>
              <div className="absolute flex items-center justify-center w-full h-full text-2xl font-bold text-white z-[2]">
                <AiFillCloseCircle />
              </div>
            </div>
            <img src={url} alt="gallery" className="w-full h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gallery;

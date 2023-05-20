import { useState, ChangeEvent } from "react";
import { IoAdd } from "react-icons/io5";

const AddCategory = () => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  const handleUploadThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    const url: string = URL.createObjectURL(files?.[0] as File);
    console.log(files?.[0]);
    setThumbnailUrl(url);
  };

  return (
    <section className="scrollHidden w-full h-full px-5 pb-5 lg:pt-5 pt-24 overflow-auto">
      <h1 className="lg:text-2xl text-xl font-bold mb-2">Add Category</h1>

      <ul className="scrollHidden flex max-h-[80vh] flex-wrap items-start mt-5 gap-3 overflow-auto">
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Title
            </span>
            <input
              required
              type="text"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Slug
            </span>
            <input
              required
              type="text"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
        </div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Thumbail
            </span>

            <label
              htmlFor="thumbnail"
              className="flex flex-col items-center justify-center w-full h-[300px] rounded-md border-2 cursor-pointer overflow-hidden"
            >
              {!thumbnailUrl && (
                <>
                  <IoAdd className="md:text-6xl text-4xl" />
                  <h3 className="text-lg font-medium text-center">
                    Click to upload
                  </h3>
                </>
              )}
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="thumbnail"
                  className="w-full h-full"
                />
              )}
              <input
                onChange={handleUploadThumbnail}
                type="file"
                id="thumbnail"
                className="hidden"
              />
            </label>
          </div>
        </div>
      </ul>
    </section>
  );
};

export default AddCategory;

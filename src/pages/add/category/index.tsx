import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";
import Popup from "~/components/Popup";

interface IOption {
  name: string;
  status: boolean;
}

interface IListOption {
  name: string;
  list: IOption[];
}

const AddCategory = () => {
  const optionRef = useRef<HTMLInputElement>(null);
  const optionItemRef = useRef<HTMLInputElement>(null);
  const optionItemStatusRef = useRef<HTMLSelectElement>(null);

  const [gallery, setGallery] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [listOption, setListOption] = useState<IListOption[]>([]);
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [optionItemIndex, setOptionItemIndex] = useState({
    firstIndex: 0,
    secondIndex: 0,
  });
  const [showOption, setShowOption] = useState<boolean>(false);
  const [showOptionItem, setShowOptionItem] = useState<boolean>(false);

  const [isEditOptionItem, setEditOptionItem] = useState<boolean>(false);

  const handleUploadGallery = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    const url: string = URL.createObjectURL(files?.[0] as File);

    setGallery([...gallery, url]);
  };

  const handleDeleteGallery = (index: number) => {
    gallery.splice(index, 1);
    setGallery([...gallery]);
  };

  const handleUploadThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    const url: string = URL.createObjectURL(files?.[0] as File);
    setThumbnailUrl(url);
  };

  const handleAddOption = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (optionRef.current) {
      const optionName = optionRef.current.value;
      setListOption([...listOption, { name: optionName, list: [] }]);
      setShowOption(false);
      optionRef.current.value = "";
    }
  };

  const getOptionItemEdit = (indexParent: number, indexChildren: number) => {
    const item = listOption[indexParent].list[indexChildren];

    if (optionItemRef.current && optionItemStatusRef.current) {
      optionItemRef.current.value = item.name;
      optionItemStatusRef.current.value = item.status ? "1" : "0";
      setOptionItemIndex({
        firstIndex: indexParent,
        secondIndex: indexChildren,
      });
      setEditOptionItem(true);
      setShowOptionItem(true);
    }
  };

  const handleEditOptionItem = () => {
    const currentList = listOption;

    if (optionItemRef.current && optionItemStatusRef.current) {
      const name = optionItemRef.current.value;
      const status = optionItemStatusRef.current.value === "1" ? true : false;
      const firstIndex = optionItemIndex.firstIndex;
      const secondIndex = optionItemIndex.secondIndex;

      currentList[firstIndex].list[secondIndex].name = name;
      currentList[firstIndex].list[secondIndex].status = status;

      setListOption(currentList);
      setShowOptionItem(false);
      setEditOptionItem(false);
    }
  };

  const handleDeleteOptionItem = () => {
    const currentList = listOption;
    const firstIndex = optionItemIndex.firstIndex;
    const secondIndex = optionItemIndex.secondIndex;

    currentList[firstIndex].list.splice(secondIndex, 1);

    setListOption(currentList);
    setShowOptionItem(false);
    setEditOptionItem(false);
  };

  const handleAddOptionItem = (e: FormEvent<HTMLFormElement>) => {
    const currentList = listOption;

    if (optionItemRef.current && optionItemStatusRef.current) {
      const name = optionItemRef.current.value;
      const status = optionItemStatusRef.current.value === "1" ? true : false;

      currentList[optionIndex].list.push({ name, status });

      setListOption(currentList);
      setShowOptionItem(false);
      optionItemRef.current.value = "";
    }
  };

  return (
    <section className="scrollHidden w-full h-screen px-5 pb-5 lg:pt-5 pt-24 overflow-auto">
      <h1 className="lg:text-2xl text-xl font-bold mb-2">Add Category</h1>

      <ul className="scrollHidden h-[80vh] mt-5 pb-5 gap-3 overflow-auto">
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

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <div className="w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Description
            </span>
            <textarea
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
              name="description"
              placeholder="Description about product..."
              cols={30}
              rows={6}
            ></textarea>
          </div>
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Category
            </span>
            <select
              name="category"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
              defaultValue="Choose category"
            >
              <option disabled>Choose category</option>
              <option value="test">Test</option>
            </select>
          </div>
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              In stock
            </span>
            <select
              name="inStock"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            >
              <option value={1}>In stock</option>
              <option value={0}>Out of stock</option>
            </select>
          </div>
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Price
            </span>
            <input
              required
              type="text"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Promorion price
            </span>
            <input
              required
              type="text"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
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
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Gallery
            </span>

            <label
              htmlFor="gallery"
              className="flex flex-col items-center justify-center w-full h-[300px] rounded-md border-2 cursor-pointer overflow-hidden"
            >
              <IoAdd className="md:text-6xl text-4xl" />
              <h3 className="text-lg font-medium text-center">
                Click to upload
              </h3>
              <input
                onChange={handleUploadGallery}
                type="file"
                id="gallery"
                className="hidden"
              />
            </label>

            <ul className="grid flex-wrap grid-cols-3 mt-4 gap-3">
              {gallery.map((url: string, index: number) => (
                <li key={index} className="relative rounded-md overflow-hidden">
                  <div
                    onClick={() => handleDeleteGallery(index)}
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
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Quantity
            </span>
            <input
              required
              type="text"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Hot product
            </span>
            <button className="relative w-[60px] h-8 bg-black rounded-3xl">
              <span className="absolute top-1/2 left-1 -translate-y-1/2 block rounded-full w-6 h-6 bg-white"></span>
            </button>
          </div>
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <div className="lg:w-1/2 w-full">
            <span className="block text-base text-[#1E1E1E] font-medium">
              Options
            </span>

            {listOption.map((item: IListOption, indexParent: number) => (
              <ul
                key={indexParent}
                className="flex flex-wrap items-center w-full min-h-[40px] rounded-md px-2 py-1 mt-5 border-2 focus:border-gray-600 outline-none gap-2"
              >
                <span className="text-base text-[#1E1E1E]">{item.name}: </span>

                {item.list.map((option: IOption, indexChildren: number) => (
                  <li
                    onClick={() => {
                      getOptionItemEdit(indexParent, indexChildren);
                    }}
                    key={indexChildren}
                    className={`w-fit text-base text-white font-medium bg-gray-600 px-2 py-1 rounded-md ${
                      !option.status && "opacity-60"
                    }`}
                  >
                    {option.name}
                  </li>
                ))}
                <button
                  onClick={() => {
                    if (optionItemRef.current) {
                      optionItemRef.current.value = "";
                    }
                    setShowOptionItem(true);
                    setEditOptionItem(false);
                    setOptionIndex(indexParent);
                  }}
                  className="lg:w-fit text-lg text-white font-medium bg-primary px-3 py-1 rounded-md"
                >
                  +
                </button>
              </ul>
            ))}

            <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 lg:gap-5 gap-2">
              <button
                onClick={() => setShowOption(!showOption)}
                className="w-fit text-lg text-white font-medium bg-success px-5 py-1 rounded-md"
              >
                + Add option
              </button>
            </div>
          </div>
        </div>
      </ul>

      <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 border-t-2 lg:gap-5 gap-2">
        <button className="w-fit text-lg text-white font-medium bg-error px-5 py-1 rounded-md">
          Cancle
        </button>
        <button className="w-fit text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
          Save
        </button>
      </div>

      {/* Popup add Options name */}
      <Popup show={showOption} onClose={() => setShowOption(!showOption)}>
        <form onSubmit={(e) => handleAddOption(e)}>
          <div>
            <span className="block text-base text-[#1E1E1E] font-medium mb-2">
              Option name
            </span>
            <input
              required
              ref={optionRef}
              type="text"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
          <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 lg:gap-5 gap-2">
            <button
              type="button"
              onClick={() => setShowOption(!showOption)}
              className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
            >
              Cancle
            </button>
            <button className="lg:w-fit w-full text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
              Add
            </button>
          </div>
        </form>
      </Popup>

      {/* Popup change Options*/}
      <Popup
        show={showOptionItem}
        onClose={() => setShowOptionItem(!showOptionItem)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!isEditOptionItem) {
              handleAddOptionItem(e);
            } else {
              handleEditOptionItem();
            }
          }}
        >
          <div>
            <span className="block text-base text-[#1E1E1E] font-medium mb-2">
              Option name
            </span>
            <input
              required
              ref={optionItemRef}
              type="name"
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            />
          </div>
          <div className="mt-3">
            <span className="block text-base text-[#1E1E1E] font-medium mb-1">
              Status
            </span>
            <select
              name="status"
              required
              ref={optionItemStatusRef}
              className="w-full rounded-md px-2 py-1 border-2 focus:border-gray-600 outline-none"
            >
              <option value={1}>In stock</option>
              <option value={0}>Out of stock</option>
            </select>
          </div>

          {!isEditOptionItem && (
            <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 lg:gap-5 gap-2">
              <button
                type="button"
                className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
              >
                Cancle
              </button>
              <button className="lg:w-fit w-full text-lg text-white font-medium bg-success px-5 py-1 rounded-md">
                Add
              </button>
            </div>
          )}

          {isEditOptionItem && (
            <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 lg:gap-5 gap-2">
              <button
                type="button"
                onClick={handleDeleteOptionItem}
                className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
              >
                Delete
              </button>
              <button className="lg:w-fit w-full text-lg text-white font-medium bg-success px-5 py-1 rounded-md">
                Save
              </button>
            </div>
          )}
        </form>
      </Popup>
    </section>
  );
};

export default AddCategory;

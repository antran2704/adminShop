import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import FieldAdd from "~/components/FieldAdd";
import Gallery from "~/components/Image/Gallery";
import Thumbnail from "~/components/Image/Thumbnail";
import Popup from "~/components/Popup";
import { deleteGallery, uploadImage } from "~/helper/handleImage";
import AddLayout from "~/layouts/FormLayout";

interface IOption {
  name: string;
  status: boolean;
}

interface IListOption {
  name: string;
  list: IOption[];
}

const AddProductPage = () => {
  const optionRef = useRef<HTMLInputElement>(null);
  const optionItemRef = useRef<HTMLInputElement>(null);
  const optionItemStatusRef = useRef<HTMLSelectElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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
  const [isEditOption, setEditOption] = useState<boolean>(false);

  const [isHotProduct, setHotProduct] = useState<boolean>(false);

  const handleChangeValue = (
    name: string,
    value: string | number | boolean
  ) => {
    console.log(name, value);
  };

  const handleUploadGallery = (e: ChangeEvent<HTMLInputElement>) => {
    const url: string = uploadImage(e.target);
    setGallery([...gallery, url]);
  };

  const handleDeleteGallery = (index: number) => {
    const newGallery = deleteGallery(index, gallery);
    setGallery([...newGallery]);
  };

  const handleUploadThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const url: string = uploadImage(e.target);
    setThumbnailUrl(url);
  };

  const handleAddOption = (e: FormEvent<HTMLFormElement>) => {
    if (optionRef.current) {
      const optionName = optionRef.current.value;
      setListOption([...listOption, { name: optionName, list: [] }]);
      setShowOption(false);
      optionRef.current.value = "";
    }
  };

  const getOptionEdit = (index: number) => {
    const item = listOption[index];

    if (optionRef.current) {
      optionRef.current.value = item.name;
    }

    setEditOption(true);
    setOptionIndex(index);
    setShowOption(!showOption);
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

  const handleEditOption = () => {
    const currentList = listOption;

    if (optionRef.current) {
      const name = optionRef.current.value;
      currentList[optionIndex].name = name;
    }

    setListOption(currentList);
    setEditOption(false);
    setShowOption(!showOption);
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

  const handleDeleteOption = () => {
    const currentList = listOption;
    const index = optionIndex;

    currentList.splice(index, 1);

    setListOption(currentList);
    setShowOption(false);
    setEditOption(false);
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

  useEffect(() => {
    if (listRef.current && listOption.length > 0) {
      listRef.current.scrollTop = listRef.current.scrollHeight + 200;
    }
  }, [listOption]);
  return (
    <AddLayout ref={listRef}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Category"
            widthFull={false}
            name="category"
            type="select"
            optionsSelect={["test1", "test2"]}
            onGetValue={handleChangeValue}
          />

          <FieldAdd
            title="In stock"
            widthFull={false}
            name="status"
            type="select"
            optionsSelect={["In stock", "Out of stock"]}
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Price"
            widthFull={false}
            name="price"
            type="input"
            onGetValue={handleChangeValue}
          />

          <FieldAdd
            title="Promorion price"
            widthFull={false}
            name="promotionPrice"
            type="input"
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            thumbnailUrl={thumbnailUrl}
            onChange={handleUploadThumbnail}
          />

          <Gallery
            gallery={gallery}
            onChange={handleUploadGallery}
            onDelete={handleDeleteGallery}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Quantity"
            widthFull={false}
            name="quantity"
            type="input"
            onGetValue={handleChangeValue}
          />

          <FieldAdd
            title="Hot product"
            widthFull={false}
            name="hotProduct"
            type="button"
            isChecked={isHotProduct}
            onClick={() => setHotProduct(!isHotProduct)}
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <div className="lg:w-1/2 w-full">
            <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 lg:gap-5 gap-2">
              <span className="block text-base text-[#1E1E1E] font-medium">
                Options
              </span>
              <button
                onClick={() => {
                  if (optionRef.current) {
                    optionRef.current.value = "";
                  }
                  setEditOption(false);
                  setShowOption(!showOption);
                }}
                className="w-fit text-lg text-white font-medium bg-success px-5 py-1 rounded-md"
              >
                +
              </button>
            </div>

            {listOption.map((item: IListOption, indexParent: number) => (
              <ul
                key={indexParent}
                className="relative flex flex-wrap items-center w-full min-h-[40px] rounded-md px-2 py-1 mt-8 border-2 focus:border-gray-600 outline-none gap-2"
              >
                <span className="text-base text-[#1E1E1E]">{item.name}: </span>

                {item.list.map((option: IOption, indexChildren: number) => (
                  <li
                    onClick={() => {
                      getOptionItemEdit(indexParent, indexChildren);
                    }}
                    key={indexChildren}
                    className={`w-fit text-base text-white font-medium bg-gray-600 px-2 py-1 rounded-md cursor-pointer ${
                      !option.status && "opacity-60"
                    }`}
                  >
                    {option.name}
                  </li>
                ))}

                <button
                  onClick={() => {
                    getOptionEdit(indexParent);
                  }}
                  className="absolute -top-5 right-0 text-xs font-medium text-white bg-primary px-2 pt-1 rounded-tl-md rounded-tr-md"
                >
                  Edit
                </button>

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
          </div>
        </div>

        {/* Popup add Options name */}
        <Popup show={showOption} onClose={() => setShowOption(!showOption)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!isEditOption) {
                handleAddOption(e);
              } else {
                handleEditOption();
              }
            }}
          >
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

            {!isEditOption && (
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
            )}

            {isEditOption && (
              <div className="flex lg:flex-nowrap flex-wrap items-center justify-between pt-5 lg:gap-5 gap-2">
                <button
                  type="button"
                  onClick={handleDeleteOption}
                  className="lg:w-fit w-full text-lg text-white font-medium bg-error px-5 py-1 rounded-md"
                >
                  Delete
                </button>
                <button className="lg:w-fit w-full text-lg text-white font-medium bg-primary px-5 py-1 rounded-md">
                  Save
                </button>
              </div>
            )}
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
                  onClick={() => setShowOptionItem(!showOptionItem)}
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
      </div>
    </AddLayout>
  );
};

export default AddProductPage;

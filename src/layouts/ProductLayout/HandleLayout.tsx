import { useState, useRef, ChangeEvent, FC, useEffect, FormEvent } from "react";

import FormLayout from "../FormLayout";
import FieldAdd from "~/components/FieldAdd";
import Thumbnail from "~/components/Image/Thumbnail";
import Gallery from "~/components/Image/Gallery";
import Popup from "~/components/Popup";
import { IOption, IListOption, IProductData } from "~/interface/product";

interface Props {
  data: IProductData;
  handleChangeValue: (name: string, value: string | number | boolean) => void;
  handleUploadGallery: (source: File, urlBase64: string) => void;
  handleDeleteGallery: (index: number) => void;
  handleUploadThumbnail: (source: File, urlBase64: string) => void;
  handleAddOption: (newOption: string) => void;
  handleEditOption: (text: string, index: number) => void;
  handleEditOptionItem: (
    name: string,
    status: boolean,
    firstIndex: number,
    secondIndex: number
  ) => void;
  handleDeleteOption: (index: number) => void;
  handleDeleteOptionItem: (firstIndex: number, secondIndex: number) => void;
  handleAddOptionItem: (index: number, name: string, status: boolean) => void;
}

const HandleLayout: FC<Props> = (props: Props) => {
  const listRef = useRef<HTMLUListElement>(null);
  const optionRef = useRef<HTMLInputElement>(null);
  const optionItemRef = useRef<HTMLInputElement>(null);
  const optionItemStatusRef = useRef<HTMLSelectElement>(null);

  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [optionItemIndex, setOptionItemIndex] = useState({
    firstIndex: 0,
    secondIndex: 0,
  });

  const [showOption, setShowOption] = useState<boolean>(false);
  const [showOptionItem, setShowOptionItem] = useState<boolean>(false);

  const [isEditOptionItem, setEditOptionItem] = useState<boolean>(false);
  const [isEditOption, setEditOption] = useState<boolean>(false);

  const handleAddOption = (e: FormEvent<HTMLFormElement>) => {
    if (optionRef.current) {
      const optionName = optionRef.current.value;
      props.handleAddOption(optionName);
      setShowOption(false);
      optionRef.current.value = "";
    }
  };

  const getOptionEdit = (index: number) => {
    const item = props.data.options[index];

    if (optionRef.current) {
      optionRef.current.value = item.name;
    }

    setEditOption(true);
    setOptionIndex(index);
    setShowOption(!showOption);
  };

  const getOptionItemEdit = (indexParent: number, indexChildren: number) => {
    const item = props.data.options[indexParent].list[indexChildren];

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
    if (optionRef.current) {
      const name = optionRef.current.value;
      props.handleEditOption(name, optionIndex);
    }
    setEditOption(false);
    setShowOption(!showOption);
  };

  const handleEditOptionItem = () => {
    if (optionItemRef.current && optionItemStatusRef.current) {
      const name = optionItemRef.current.value;
      const status = optionItemStatusRef.current.value === "1" ? true : false;
      const firstIndex = optionItemIndex.firstIndex;
      const secondIndex = optionItemIndex.secondIndex;

      props.handleEditOptionItem(name, status, firstIndex, secondIndex);
      setShowOptionItem(false);
      setEditOptionItem(false);
    }
  };

  const handleDeleteOption = () => {
    props.handleDeleteOption(optionIndex);
    setShowOption(false);
    setEditOption(false);
  };

  const handleDeleteOptionItem = () => {
    const firstIndex = optionItemIndex.firstIndex;
    const secondIndex = optionItemIndex.secondIndex;

    props.handleDeleteOptionItem(firstIndex, secondIndex);
    setShowOptionItem(false);
    setEditOptionItem(false);
  };

  const handleAddOptionItem = (e: FormEvent<HTMLFormElement>) => {
    if (optionItemRef.current && optionItemStatusRef.current) {
      const name = optionItemRef.current.value;
      const status = optionItemStatusRef.current.value === "1" ? true : false;
      props.handleAddOptionItem(optionIndex, name, status);

      setShowOptionItem(false);
      optionItemRef.current.value = "";
    }
  };

  useEffect(() => {
    if (listRef.current && props.data.options.length > 0) {
      listRef.current.scrollTop = listRef.current.scrollHeight + 200;
    }
  }, [props.data.options]);
  return (
    <FormLayout ref={listRef}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Category"
            widthFull={false}
            name="category"
            type="select"
            optionsSelect={["test1", "test2"]}
            onGetValue={props.handleChangeValue}
          />

          <FieldAdd
            title="In stock"
            widthFull={false}
            name="status"
            type="select"
            optionsSelect={["In stock", "Out of stock"]}
            onGetValue={props.handleChangeValue}
          />
        </div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Name of product"
            widthFull={false}
            name="name"
            type="input"
            value={props.data.name}
            onGetValue={props.handleChangeValue}
          />

          <FieldAdd
            title="Short Detail"
            widthFull={false}
            name="shortDescription"
            type="input"
            value={props.data.shortDescription}
            onGetValue={props.handleChangeValue}
          />
        </div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Description of product"
            widthFull={true}
            name="description"
            type="textarea"
            value={props.data.description}
            onGetValue={props.handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Price"
            value={props.data.price}
            widthFull={false}
            name="price"
            type="input"
            onGetValue={props.handleChangeValue}
          />

          <FieldAdd
            title="Promorion price"
            value={props.data.promotionPrice}
            widthFull={false}
            name="promotionPrice"
            type="input"
            onGetValue={props.handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            thumbnailUrl={props.data.thumbnail.urlBase64}
            onChange={props.handleUploadThumbnail}
          />

          <Gallery
            gallery={props.data.gallery}
            onChange={props.handleUploadGallery}
            onDelete={props.handleDeleteGallery}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Quantity"
            widthFull={false}
            name="quantity"
            type="input"
            onGetValue={props.handleChangeValue}
          />

          <FieldAdd
            title="Hot product"
            widthFull={false}
            name="hotProduct"
            type="button"
            isChecked={props.data.hotProduct}
            // onClick={() => setData({ ...data, hotProduct: !data.hotProduct })}
            onGetValue={props.handleChangeValue}
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

            {props.data.options.map(
              (item: IListOption, indexParent: number) => (
                <ul
                  key={indexParent}
                  className="relative flex flex-wrap items-center w-full min-h-[40px] rounded-md px-2 py-1 mt-8 border-2 focus:border-gray-600 outline-none gap-2"
                >
                  <span className="text-base text-[#1E1E1E]">
                    {item.name}:{" "}
                  </span>

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
              )
            )}
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
    </FormLayout>
  );
};

export default HandleLayout;

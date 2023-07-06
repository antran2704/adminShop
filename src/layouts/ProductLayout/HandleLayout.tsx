import { useState, useRef, FC, useEffect, memo, useCallback } from "react";
import axios from "axios";

import {
  IOption,
  IListOption,
  IProductData,
  ICategory,
  ITypeProduct,
} from "~/interface/product";
import { IThumbnail } from "~/interface/image";
import { typeInput } from "~/enums";

import FormLayout from "../FormLayout";
import Input from "~/components/Input";
import Thumbnail from "~/components/Image/Thumbnail";
import Gallery from "~/components/Image/Gallery";
import Popup from "~/components/Popup";

import {
  deleteGallery,
  uploadGalleryOnServer,
  uploadImageOnServer,
} from "~/helper/handleImage";

import ButtonCheck from "~/components/Button/ButtonCheck";

import SelectItem from "~/components/Select/SelectItem";
import SelectMutipleItem from "~/components/Select/SelectMutipleItem";

interface Props {
  initData: IProductData;
  categories: ICategory[];
  onSubmit: (data: IProductData) => void;
}

const HandleLayout: FC<Props> = (props: Props) => {
  const listRef = useRef<HTMLUListElement>(null);
  const optionRef = useRef<HTMLInputElement>(null);
  const optionItemRef = useRef<HTMLInputElement>(null);
  const optionItemStatusRef = useRef<HTMLSelectElement>(null);

  const [data, setData] = useState<IProductData>(props.initData);
  const [selectCategory, setSelectCategory] = useState<ICategory>({
    _id: null,
    title: null,
    options: null,
  });

  const [productType, setProductType] = useState<ITypeProduct[]>([]);

  const [selectProductType, setSelectType] = useState<ITypeProduct[]>([]);

  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [optionItemIndex, setOptionItemIndex] = useState({
    firstIndex: 0,
    secondIndex: 0,
  });

  const [showOption, setShowOption] = useState<boolean>(false);
  const [showOptionItem, setShowOptionItem] = useState<boolean>(false);

  const [isEditOptionItem, setEditOptionItem] = useState<boolean>(false);
  const [isEditOption, setEditOption] = useState<boolean>(false);

  const handleChangeValue = useCallback(
    (name: string | undefined, value: string | number | boolean) => {
      if (name) {
        setData({ ...data, [name]: value });
      }
    },
    [data]
  );

  const handleSelectCategory = useCallback(
    (item: ICategory) => {
      setSelectCategory(item);

      if (item?.options) {
        getOption(item.options);
      }
    },
    [selectCategory, productType]
  );

  const handleSelectTypeProduct = useCallback(
    (item: ITypeProduct) => {
      if (!selectProductType.includes(item)) {
        setSelectType([...selectProductType, item]);
      } else {
        handleDeleteTypeProduct(item._id);
      }
    },
    [selectProductType]
  );

  const handleDeleteTypeProduct = useCallback(
    (id: string | null) => {
      if (id) {
        const newList = selectProductType.filter(
          (item: ITypeProduct) => item._id !== id
        );
        setSelectType(newList);
      }
    },
    [selectProductType, productType]
  );

  const handleUploadGallery = (source: File, urlBase64: string) => {
    setData({ ...data, gallery: [...data.gallery, { source, urlBase64 }] });
  };

  const handleDeleteGallery = (index: number) => {
    const newGallery = deleteGallery(index, data.gallery);
    setData({ ...data, gallery: [...newGallery] });
  };

  const handleUploadThumbnail = (source: File, urlBase64: string) => {
    setData({ ...data, thumbnail: { source, urlBase64 } });
  };

  const handleAddOption = useCallback(() => {
    if (optionRef.current) {
      const newOption = optionRef.current.value;
      setData({
        ...data,
        options: [...data.options, { title: newOption, list: [] }],
      });
      setShowOption(!showOption);
      optionRef.current.value = "";
    }
  }, [data.options, showOption]);

  const getOptionEdit = (index: number) => {
    const item = data.options[index];

    if (optionRef.current) {
      optionRef.current.value = item.title;
    }

    setEditOption(true);
    setOptionIndex(index);
    setShowOption(!showOption);
  };

  const getOptionItemEdit = (indexParent: number, indexChildren: number) => {
    const item = data.options[indexParent].list[indexChildren];

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

  const handleEditOption = useCallback(() => {
    if (optionRef.current) {
      const name = optionRef.current.value;
      const currentList = data.options;
      currentList[optionIndex].title = name;

      setData({ ...data, options: currentList });
    }
    setEditOption(false);
    setShowOption(!showOption);
  }, [data.options]);

  const handleEditOptionItem = useCallback(() => {
    if (optionItemRef.current && optionItemStatusRef.current) {
      const name = optionItemRef.current.value;
      const status = optionItemStatusRef.current.value === "1" ? true : false;
      const firstIndex = optionItemIndex.firstIndex;
      const secondIndex = optionItemIndex.secondIndex;

      const currentList = data.options;

      currentList[firstIndex].list[secondIndex].name = name;
      currentList[firstIndex].list[secondIndex].status = status;

      setData({ ...data, options: currentList });
      setShowOption(false);
      setEditOption(false);
    }
  }, [data.options]);

  const handleDeleteOption = useCallback(() => {
    const currentList = data.options;

    currentList.splice(optionIndex, 1);

    setData({ ...data, options: currentList });
    setShowOption(false);
    setEditOption(false);
  }, [data.options]);

  const handleDeleteOptionItem = useCallback(() => {
    const firstIndex = optionItemIndex.firstIndex;
    const secondIndex = optionItemIndex.secondIndex;
    const currentList = data.options;
    currentList[firstIndex].list.splice(secondIndex, 1);

    setData({ ...data, options: currentList });
    setShowOptionItem(false);
    setEditOptionItem(false);
  }, [data.options]);

  const handleAddOptionItem = useCallback(() => {
    if (optionItemRef.current && optionItemStatusRef.current) {
      const name = optionItemRef.current.value;
      const status = optionItemStatusRef.current.value === "1" ? true : false;
      const currentList = data.options;

      currentList[optionIndex].list.push({
        name,
        status,
      });

      setData({ ...data, options: currentList });
      setShowOptionItem(false);
      optionItemRef.current.value = "";
    }
  }, [data.options]);

  const getOption = async (id: string) => {
    try {
      const optionData = await axios
        .get(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/option/${id}`)
        .then((res) => res.data);

      if (optionData.status === 200) {
        setProductType(optionData.payload.list);
      }
    } catch (error) {
      setProductType([]);
    }
  };

  const onSubmit = () => {
    const sendData = data;
    sendData.category = selectCategory;
    sendData.type = selectProductType;

    props.onSubmit(sendData);
  };

  useEffect(() => {
    if (listRef.current && data.options.length > 0) {
      listRef.current.scrollTop = listRef.current.scrollHeight + 200;
    }
  }, [data.options]);

  return (
    <FormLayout onSubmit={onSubmit} ref={listRef}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <SelectItem
            title="Category"
            widthFull={false}
            data={selectCategory}
            categories={props.categories}
            onSelect={handleSelectCategory}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <SelectMutipleItem
            title="Type product"
            widthFull={false}
            data={selectProductType}
            types={productType}
            onSelect={handleSelectTypeProduct}
            onDelete={handleDeleteTypeProduct}
          />
        </div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Name of product"
            widthFull={false}
            name="title"
            type={typeInput.input}
            value={data.title}
            onGetValue={handleChangeValue}
          />
        </div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Short Detail"
            widthFull={false}
            name="shortDescription"
            type={typeInput.textarea}
            value={data.shortDescription}
            onGetValue={handleChangeValue}
          />
        </div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Description of product"
            widthFull={false}
            name="description"
            type={typeInput.textarea}
            value={data.description}
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Price"
            checkValidNumber
            value={data.price}
            widthFull={false}
            name="price"
            type={typeInput.input}
            onGetValue={handleChangeValue}
          />

          <Input
            title="Promorion price"
            value={data.promotionPrice?.toString()}
            checkValidNumber
            widthFull={false}
            name="promotionPrice"
            type={typeInput.input}
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            thumbnailUrl={data.thumbnail.urlBase64}
            onChange={handleUploadThumbnail}
          />

          <Gallery
            gallery={data.gallery}
            onChange={handleUploadGallery}
            onDelete={handleDeleteGallery}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <Input
            title="Quantity"
            widthFull={false}
            value={data.quantity}
            checkValidNumber
            name="quantity"
            type={typeInput.input}
            onGetValue={handleChangeValue}
          />

          <ButtonCheck
            title="Status"
            name="status"
            widthFull={false}
            isChecked={data.status}
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

            {data.options.map((item: IListOption, indexParent: number) => (
              <ul
                key={indexParent}
                className="relative flex flex-wrap items-center w-full min-h-[40px] rounded-md px-2 py-1 mt-8 border-2 focus:border-gray-600 outline-none gap-2"
              >
                <span className="text-base text-[#1E1E1E]">{item.title}: </span>

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
                handleAddOption();
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
                handleAddOptionItem();
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

export default memo(HandleLayout);

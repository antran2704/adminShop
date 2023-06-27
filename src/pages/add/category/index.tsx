import { useRouter } from "next/router";
import axios from "axios";
import { useState, useRef, ChangeEvent, FormEvent } from "react";

import FieldAdd from "~/components/FieldAdd";
import Thumbnail from "~/components/Image/Thumbnail";

import { uploadImage } from "~/helper/handleImage";
import AddLayout from "~/layouts/AddLayout";
import Popup from "~/components/Popup";

interface IThumbnailUrl {
  source: FileList | {};
  url: string;
}

interface IOption {
    title: string;
}

interface IDataCategory {
  title: string;
  description: string;
  thumbnail: string;
  options: IOption[];
}

const initData: IDataCategory = {
  title: "",
  description: "",
  thumbnail: "",
  options: [],
};

const AddCategoryPage = () => {
  const router = useRouter();

  const optionRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<IDataCategory>(initData);
  const [selectOptionIndex, setSelectOptionIndex] = useState<number | null>(
    null
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<IThumbnailUrl>({
    source: {},
    url: "",
  });

  const [showOption, setShowOption] = useState<boolean>(false);
  const [isEditOption, setEditOption] = useState<boolean>(false);

  const handleChangeValue = (
    name: string,
    value: string | number | boolean
  ) => {
    setData({ ...data, [name]: value });
  };

  const handleUploadThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (/^image\//.test(file.type)) {
        const name = e.target.name;
        const source: object = file;
        const url: string = uploadImage(e.target);

        setThumbnailUrl({ source, url });
        setData({ ...data, [name]: url });
      }
    }
  };

  const handleShowPopup = () => {
    setShowOption(!showOption);
  };

  const handleAddOption = (e: FormEvent<HTMLFormElement>) => {
    setEditOption(false);

    if (optionRef.current) {
      const newOption = optionRef.current.value;
      setData({ ...data, options: [...data.options, {title: newOption}] });
      setShowOption(false);
      optionRef.current.value = "";
    }
  };

  const handleSelectOption = (text: string, index: number) => {
    if (optionRef.current) {
      optionRef.current.value = text;
      setSelectOptionIndex(index);
      setEditOption(true);
      setShowOption(true);
    }
  };

  const handleEditOption = () => {
    if (optionRef.current && selectOptionIndex !== null) {
      const newOption = optionRef.current.value;
      const oldOptions = data.options;

      oldOptions[selectOptionIndex].title = newOption;

      setData({ ...data, options: [...oldOptions] });
      setShowOption(false);
      setEditOption(false);

      optionRef.current.value = "";
    }
  };

  const handleDeleteOption = () => {
    if (optionRef.current && selectOptionIndex) {
      optionRef.current.value = "";
      const oldOptions = data.options;

      oldOptions.splice(selectOptionIndex, 1);
      setData({ ...data, options: [...oldOptions] });
      setShowOption(false);
      setEditOption(false);
    }
  };

  const handleOnSubmit = async () => {
    const formData = new FormData();
    const source: any = thumbnailUrl.source;
    formData.append("thumbnail", source);

    try {
      const uploadPayload = await axios
        .post(
          `${process.env.NEXT_PUBLIC_ENDPOINT_API}/category/uploadThumbnail`,
          formData
        )
        .then((res) => res.data);

      const payload = await axios
        .post(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/category`, {
          ...data,
          thumbnail: uploadPayload.payload.thumbnail,
        })
        .then((res) => res.data);

      if (payload.status === 200) {
        console.log("upload successfully");
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AddLayout onSubmit={handleOnSubmit}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
          <FieldAdd
            title="Title"
            widthFull={false}
            name="title"
            type="input"
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Description"
            widthFull={true}
            name="description"
            type="textarea"
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            thumbnailUrl={thumbnailUrl.url}
            onChange={handleUploadThumbnail}
          />
          <div className="lg:w-1/2 w-full">
            <div className="flex items-center justify-between">
              <span className="block text-base text-[#1E1E1E] font-medium">
                Options
              </span>
              <button
                onClick={handleShowPopup}
                className="w-fit text-lg text-white font-medium bg-success px-5 py-1 rounded-md"
              >
                +
              </button>
            </div>
            <ul className="flex flex-wrap items-center gap-2">
              {data.options.map((option: IOption, index: number) => (
                <li
                  key={index}
                  onClick={() => handleSelectOption(option.title, index)}
                  className="w-fit text-base text-white font-medium bg-gray-600 px-2 py-1 rounded-md cursor-pointer"
                >
                  {option.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Popup add Options name */}
        <Popup show={showOption} onClose={handleShowPopup}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isEditOption) {
                handleAddOption(e);
              } else {
                handleEditOption();
              }
              setShowOption(!showOption);
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
      </div>
    </AddLayout>
  );
};

export default AddCategoryPage;

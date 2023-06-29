import { useState, useRef, ChangeEvent, FC, useEffect } from "react";

import FieldAdd from "~/components/FieldAdd";
import Thumbnail from "~/components/Image/Thumbnail";

import { uploadImage } from "~/helper/handleImage";
import FormLayout from "~/layouts/FormLayout";
import Popup from "~/components/Popup";
import { IThumbnailUrl, IOption, IDataCategory } from "~/interface/category";

interface Props {
  data: IDataCategory;
  selectOptionIndex: number | null;
  thumbnailUrl: IThumbnailUrl;
  handleChangeValue: (name: string, value: string | number | boolean) => void;
  uploadThumbnail: (source: object, url: string) => void;
  addOption: (newOption: string) => void;
  selectOption: (index: number) => void;
  editOption: (newOption: string) => void;
  deleteOption: () => void;
  handleOnSubmit: () => void;
}

const HandleLayout: FC<Props> = (props: Props) => {
  const optionRef = useRef<HTMLInputElement>(null);

  const [showOption, setShowOption] = useState<boolean>(false);
  const [isEditOption, setEditOption] = useState<boolean>(false);

  const handleChangeValue = (
    name: string,
    value: string | number | boolean
  ) => {
    props.handleChangeValue(name, value);
  };

  const handleUploadThumbnail = (source: File, urlBase64: string) => {
    props.uploadThumbnail(source, urlBase64);
  };

  const handleShowPopup = () => {
    setShowOption(!showOption);
  };

  const handleAddOption = () => {
    if (optionRef.current) {
      const newOption = optionRef.current.value;
      props.addOption(newOption);
      setShowOption(false);
    }
  };

  const handleSelectOption = (text: string, index: number) => {
    if (optionRef.current) {
      optionRef.current.value = text;
      props.selectOption(index);
      setEditOption(true);
      setShowOption(true);
    }
  };

  const handleEditOption = () => {
    if (optionRef.current && props.selectOptionIndex !== null) {
      const newOption = optionRef.current.value;
      props.editOption(newOption);
      setShowOption(false);
    }
  };

  const handleDeleteOption = () => {
    if (optionRef.current && props.selectOptionIndex !== null) {
      optionRef.current.value = "";
      props.deleteOption();
      setShowOption(false);
    }
  };

  useEffect(() => {
    if (!showOption && optionRef.current) {
      setEditOption(false);
      optionRef.current.value = "";
    }
  }, [showOption]);
  return (
    <FormLayout onSubmit={props.handleOnSubmit}>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between lg:gap-5 gap-3">
          <FieldAdd
            title="Title"
            widthFull={false}
            value={props.data.title}
            name="title"
            type="input"
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-center justify-between mt-5 lg:gap-5 gap-3">
          <FieldAdd
            title="Description"
            widthFull={true}
            value={props.data.description}
            name="description"
            type="textarea"
            onGetValue={handleChangeValue}
          />
        </div>

        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            thumbnailUrl={props.thumbnailUrl.url}
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
              {props.data.options.map((option: IOption, index: number) => (
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
                handleAddOption();
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
    </FormLayout>
  );
};

export default HandleLayout;

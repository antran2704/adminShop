import { useState } from "react";
import Popup from "../Popup";
import { useTranslation } from "react-i18next";
import ImageCus from "./ImageCus";

interface Props {
  url: string | null;
  name?: string;
  images: string[];
  onChange?: (name: string, value: string) => void;
  className?: string;
}

const SelectImage = (props: Props) => {
  const { url, className, images, name, onChange } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const onSelectImage = (url: string) => {
    if (onChange) {
      onChange(name as string, url);
    }
    
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setOpen(!open);
  };

  const handleShowImage = () => {
    if (url) {
      setShow(!show);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${className ? className : "w-10 h-10"} ${
          url ? "cursor-pointer" : "cursor-default"
        } rounded-full overflow-hidden`}
        onClick={handleShowImage}
      >
        <ImageCus className="w-full h-full" src={(process.env.NEXT_PUBLIC_ENDPOINT_API) as string + url}/>
      </div>
      <button onClick={handleOpenModal} className="text-sm dark:text-darkText whitespace-nowrap">
        {t("Action.change")}
      </button>
      
      {open && (
        <Popup title="Select image" show={open} onClose={handleOpenModal}>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
            {images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => onSelectImage(image)}
                className="rounded-md overflow-hidden min-h-[260px] max-h-[260px]"
              >
                {/* <img
                  src={process.env.NEXT_PUBLIC_ENDPOINT_API + image}
                  className="object-cover object-center h-full"
                /> */}
                <ImageCus className="object-cover object-center h-full" src={(process.env.NEXT_PUBLIC_ENDPOINT_API) as string + image}/>
              </button>
            ))}
          </div>
        </Popup>
      )}

      {show && url && (
        <Popup title="Image" show={show} onClose={handleShowImage}>
          <div className="md:w-3/4 w-full mx-auto pb-5 overflow-hidden">
            {/* <img
              src={url}
              className="h-full w-full object-contain object-center rounded-lg"
            /> */}
             <ImageCus className="h-full w-full object-contain object-center rounded-lg" src={(process.env.NEXT_PUBLIC_ENDPOINT_API) as string + url}/>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default SelectImage;

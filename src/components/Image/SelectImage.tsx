import { useState } from "react";
import Popup from "../Popup";

interface Props {
  thumbnailUrl: string | null;
  images: string[];
  className?: string;
}

const initImages: string[] = [
  "https://images.unsplash.com/photo-1682687221323-6ce2dbc803ab?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1700087531475-a1cb6e8e68c1?q=80&w=1881&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1682687982046-e5e46906bc6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1699138837938-86bbe20393bc?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1682687221323-6ce2dbc803ab?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1700087531475-a1cb6e8e68c1?q=80&w=1881&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1682687982046-e5e46906bc6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const SelectImage = (props: Props) => {
  const { thumbnailUrl, className, images = initImages } = props;
  const [image, setImage] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const onSelectImage = (url: string) => {
    setImage(url);
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setOpen(!open);
  };

  const handleShowImage = () => {
    if (image) {
      setShow(!show);
    }
  };

  return (
    <div>
      <div
        className={`${className ? className : ""} ${image ? "cursor-pointer" : "cursor-default"} rounded-full overflow-hidden`}
        onClick={handleShowImage}
      >
        <img
          src={
            image
              ? image
              : "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
          }
          alt="thumbnail"
          className="w-full h-full"
        />
      </div>
      <button onClick={handleOpenModal} className="text-sm">
        Change
      </button>
      {open && (
        <Popup title="Select image" show={open} onClose={handleOpenModal}>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
            {initImages.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => onSelectImage(image)}
                className="rounded-md overflow-hidden min-h-[260px] max-h-[260px]"
              >
                <img
                  src={image}
                  className="object-cover object-center h-full"
                />
              </button>
            ))}
          </div>
        </Popup>
      )}

      {show && image && (
        <Popup title="Image" show={show} onClose={handleShowImage}>
          <div className="md:w-3/4 w-full mx-auto min-h-[400px] rounded-lg overflow-hidden">
            <img src={image} className="h-full w-full object-cover object-center" />
          </div>
        </Popup>
      )}
    </div>
  );
};

export default SelectImage;

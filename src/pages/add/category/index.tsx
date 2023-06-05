import { useState, ChangeEvent } from "react";
import { IoAdd } from "react-icons/io5";
import Thumbnail from "~/components/Image/Thumbnail";

import { uploadImage } from "~/helper/handleImage";

import AddLayout from "~/layouts/AddLayout";

const AddCategoryPage = () => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  const handleUploadThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const url: string = uploadImage(e.target);
    setThumbnailUrl(url);
  };

  return (
    <AddLayout>
      <div>
        <div className="w-full flex lg:flex-nowrap flex-wrap items-start justify-between mt-5 lg:gap-5 gap-3">
          <Thumbnail
            thumbnailUrl={thumbnailUrl}
            onChange={handleUploadThumbnail}
          />
        </div>
      </div>
    </AddLayout>
  );
};

export default AddCategoryPage;

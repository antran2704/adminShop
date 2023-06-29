import { useState } from "react";
import { deleteGallery } from "~/helper/handleImage";
import { IProductData } from "~/interface/product";
import HandleLayout from "~/layouts/ProductLayout/HandleLayout";

const initData: IProductData = {
  name: "",
  category: "",
  type: [],
  shortDescription: "",
  description: "",
  price: "",
  promotionPrice: "",
  quantity: "",
  thumbnail: { source: {}, urlBase64: "" },
  gallery: [],
  brand: null,
  options: [],
  hotProduct: false,
  status: true,
};

const AddProductPage = () => {
  const [data, setData] = useState<IProductData>(initData);

  const handleChangeValue = (
    name: string,
    value: string | number | boolean
  ) => {
    setData({ ...data, [name]: value });
    console.log(name, value);
  };

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

  const handleAddOption = (newOption: string) => {
    setData({
      ...data,
      options: [...data.options, { name: newOption, list: [] }],
    });
  };

  const handleEditOption = (text: string, index: number) => {
    const currentList = data.options;
    currentList[index].name = text;

    setData({ ...data, options: currentList });
  };

  const handleEditOptionItem = (
    name: string,
    status: boolean,
    firstIndex: number,
    secondIndex: number
  ) => {
    const currentList = data.options;

    currentList[firstIndex].list[secondIndex].name = name;
    currentList[firstIndex].list[secondIndex].status = status;

    setData({ ...data, options: currentList });
  };

  const handleDeleteOption = (index: number) => {
    const currentList = data.options;

    currentList.splice(index, 1);

    setData({ ...data, options: currentList });
  };

  const handleDeleteOptionItem = (firstIndex: number, secondIndex: number) => {
    const currentList = data.options;

    currentList[firstIndex].list.splice(secondIndex, 1);

    setData({ ...data, options: currentList });
  };

  const handleAddOptionItem = (
    index: number,
    name: string,
    status: boolean
  ) => {
    const currentList = data.options;

    currentList[index].list.push({
      name,
      status,
    });

    setData({ ...data, options: currentList });
  };

  return (
    <HandleLayout
      data={data}
      handleChangeValue={handleChangeValue}
      handleUploadGallery={handleUploadGallery}
      handleDeleteGallery={handleDeleteGallery}
      handleUploadThumbnail={handleUploadThumbnail}
      handleAddOption={handleAddOption}
      handleEditOption={handleEditOption}
      handleEditOptionItem={handleEditOptionItem}
      handleDeleteOption={handleDeleteOption}
      handleDeleteOptionItem={handleDeleteOptionItem}
      handleAddOptionItem={handleAddOptionItem}
    />
  );
};

export default AddProductPage;

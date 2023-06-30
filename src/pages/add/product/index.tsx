import axios from "axios";
import { useState, useEffect } from "react";
import { IProductData, ICategory } from "~/interface/product";
import HandleLayout from "~/layouts/ProductLayout/HandleLayout";

const initData: IProductData = {
  name: "",
  category: null,
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
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getCategories = async () => {
    try {
      const data = await axios
        .get(`${process.env.NEXT_PUBLIC_ENDPOINT_API}/product/getCategories`)
        .then((res) => res.data);

      if (data.status === 200) {
        setCategories(data.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <HandleLayout
      initData={initData}
      categories={categories}
    />
  );
};

export default AddProductPage;

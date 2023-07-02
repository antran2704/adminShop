import { IThumbnail } from "../image";

interface IOption {
  name: string;
  status: boolean;
}

interface IListOption {
  name: string;
  list: IOption[];
}

interface ITypeProduct {
  title: string;
  _id: string;
}

interface IProductData {
  name: string;
  category?: string | null;
  type: ITypeProduct[] | [];
  shortDescription: string;
  description: string;
  price: string;
  promotionPrice: string;
  quantity: string;
  thumbnail: IThumbnail;
  gallery: IThumbnail[];
  brand: string | null;
  options: IListOption[];
  hotProduct: boolean | false;
  status: boolean | true;
}

interface ICategory {
  _id: string | null;
  title: string | null;
  option: string | null;
}

export type { IOption, IListOption, ITypeProduct, IProductData, ICategory };

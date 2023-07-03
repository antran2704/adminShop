import { IThumbnail } from "../image";

interface IOption {
  name: string;
  status: boolean;
}

interface IListOption {
  title: string;
  list: IOption[];
}

interface ITypeProduct {
  _id: string | null;
  title: string | null;
}

interface ICategory extends ITypeProduct {
  options: string | null;
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

export type { IOption, IListOption, ITypeProduct, IProductData, ICategory };

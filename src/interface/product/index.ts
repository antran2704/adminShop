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
  _id?: string | null;
  title: string;
  category?: ICategory | null;
  slug?: string;
  type: ITypeProduct[] | [];
  shortDescription: string;
  description: string;
  price: number;
  promotionPrice: number | null;
  quantity: number;
  thumbnail: IThumbnail;
  gallery: IThumbnail[];
  brand: string | null;
  options: IListOption[];
  hotProduct: boolean | false;
  status: boolean | true;
  createdAt?: string;
}

export type { IOption, IListOption, ITypeProduct, IProductData, ICategory };
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
  id: string;
}

interface IProductData {
  name: string;
  category?: string;
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

export type { IOption, IListOption, ITypeProduct, IProductData };

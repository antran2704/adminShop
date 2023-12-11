import { IParentCategory } from "../category";

interface IValueOption {
  label: string;
  _id?: string;
}

interface IOptionProduct {
  code: string;
  name: string;
  values: IValueOption[];
}

interface ISpecificationAttributes {
  id: string;
  [name: string]: string;
}

interface ISpecificationsProduct {
  id: string;
  name: string;
  attributes: ISpecificationAttributes[];
}

interface IVariantProduct {
  _id: string | null;
  product_id: string;
  title: string;
  barcode: string;
  available: boolean;
  price: number;
  promotion_price: number;
  sku: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  options: string[];
  thumbnail: string | null;
  url: string | null;
  inventory: number;
  sold: number;
  public: boolean;
}

interface IProductData {
  _id: string | null;
  title: string;
  category: IParentCategory;
  categories: IParentCategory[];
  slug?: string;
  type: [];
  shortDescription: string;
  description: string;
  price: number;
  promotion_price: number;
  options: IOptionProduct[];
  inventory: number;
  thumbnail: string | null;
  gallery: string[];
  brand: string | null;
  hotProduct: boolean | false;
  public: boolean | true;
  specifications: ISpecificationsProduct[];
  viewer: number;
  rate: number;
  variants: IVariantProduct[];
  breadcrumbs: string[];
  createdAt?: string;
}

type ICreateProduct = Omit<
  IProductData,
  "_id" | "viewer" | "rate" | "slug" | "type" | "createdAt"
>;

type IProductHome = Pick<
  IProductData,
  | "_id"
  | "title"
  | "public"
  | "price"
  | "promotion_price"
  | "inventory"
  | "category"
  | "thumbnail"
>;

export type {
  IProductData,
  IProductHome,
  IVariantProduct,
  IOptionProduct,
  ISpecificationsProduct,
  ICreateProduct,
  ISpecificationAttributes,
  IValueOption,
};

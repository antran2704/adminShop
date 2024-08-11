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

interface IProduct {
  _id: string;
  title: string;
  meta_title: string;
  meta_description: string;
  thumbnail: string | null;
  gallery: string[];
  shortDescription: string;
  description: string;
  category: IParentCategory;
  categories: IParentCategory[];
  barcode: string | null;
  sku: string | null;
  price: number;
  promotion_price: number;
  inventory: number;
  sold: number;
  hotProduct: boolean;
  public: boolean;
  options: IOptionProduct[];
  specifications: ISpecificationsProduct[];
  variations: IVariantProduct[];
  breadcrumbs: string[];
  viewer: number;
  slug: string;
  rate: number;
  createdAt: string;
}

interface IVariantProduct extends IProduct {
  product_id: string;
  available: boolean;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  options: string[];
  url: string | null;
}

type ICreateProduct = Omit<
  IProduct,
  | "_id"
  | "viewer"
  | "rate"
  | "slug"
  | "type"
  | "createdAt"
  | "category"
  | "categories"
  | "breadcrumbs"
  | "variations"
> & {
  variations: string[];
  category: string;
  categories: string[];
};

interface IProductTable {
  key: string;
  productId: string;
  title: string;
  thumbnail: string | null;
  category: string;
  price: number;
  promotionPrice: number;
  inventory: number;
  public: boolean;
  createdAt: string;
}

export type {
  IProduct,
  IProductTable,
  ICreateProduct,
  IVariantProduct,
  IOptionProduct,
  ISpecificationsProduct,
  ISpecificationAttributes,
  IValueOption,
};

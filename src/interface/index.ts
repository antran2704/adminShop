// Interface of Table
import { IDataTable, IDataCelTable } from "./table";
export type { IDataTable, IDataCelTable };

// Interface of Select
import { ISelectItem } from "./Select";
export type { ISelectItem };

// Interface of Attribute
import { IVariant, IAttribute, INewVariant } from "./attribute";
export type { IVariant, IAttribute, INewVariant };

// Interface of category
import {
  IThumbnailUrl,
  IOption,
  IDataCategory,
  IParentCategory,
  ICategorySelect,
  IObjectCategory,
  IBreadcrumbCategory,
} from "./category";

export type {
  IThumbnailUrl,
  IOption,
  IDataCategory,
  IParentCategory,
  ICategorySelect,
  IObjectCategory,
  IBreadcrumbCategory,
};

// Interface of Thumbnail
import { IThumbnail } from "./image";
export type { IThumbnail };

// Interface of Filter
import { IFilter } from "./filter";
export type { IFilter };

// Interface of Pagination
import { IPagination } from "./pagination";
export type { IPagination };

// Interface of Product
import {
  IProductData,
  IProductHome,
  IVariantProduct,
  IOptionProduct,
  ICreateProduct,
  ISpecificationsProduct,
  ISpecificationAttributes,
  IValueOption,
} from "./product";
export type {
  IProductData,
  IProductHome,
  IVariantProduct,
  IOptionProduct,
  ICreateProduct,
  ISpecificationsProduct,
  ISpecificationAttributes,
  IValueOption,
};

// Interface of Coupon
import { ICoupon, ICouponHome, ICouponCreate } from "./coupon";
export type { ICoupon, ICouponHome, ICouponCreate };

// Interface of Breadcrumb
import { IBreadcrumb } from "./breadcrum";
export type { IBreadcrumb };

// AXIOS
import { AxiosResponseError } from "./responseAxios";
export type { AxiosResponseError };
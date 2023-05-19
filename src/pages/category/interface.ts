export interface IFilterCategory {
  title: string;
  listFilterItem: string[];
}

export interface ICategory {
  _id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  filters: IFilterCategory[];
}

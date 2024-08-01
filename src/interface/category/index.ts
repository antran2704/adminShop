interface IThumbnailUrl {
  source: FileList | {};
  url: string;
}

interface IOption {
  title: string;
}

interface IBreadcrumbCategory {
  label: string;
  url_path: string;
}

interface IParentCategory {
  _id: string;
  parent_id: string | null;
  title: string;
  children: string[];
}

interface ICategory {
  _id: string;
  parent_id: IParentCategory | string | null;
  children: string[];
  title: string;
  description: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  public: boolean;
  thumbnail: string;
  breadcrumbs?: IBreadcrumbCategory[] | string[];
  createdAt: string;
}

interface ICreateCategory {
  title: string;
  description: string;
  parent_id: string | null;
  childrens?: string[];
  meta_title?: string;
  meta_description?: string;
  public: boolean;
  thumbnail: string;
}

interface ICategorySelect {
  title: string | null;
  node_id: string | null;
}

interface ICategoryTable {
  key: string;
  id: string;
  title: string;
  image: string;
  public: boolean;
  createdAt: string;
}

export type {
  IThumbnailUrl,
  IOption,
  ICategory,
  IParentCategory,
  ICategorySelect,
  IBreadcrumbCategory,
  ICategoryTable,
  ICreateCategory,
};

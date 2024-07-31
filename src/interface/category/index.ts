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
  _id: string | null;
  title: string;
}

interface ICategory {
  _id: string;
  parent_id: IParentCategory | string | null;
  childrens?: string[];
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

interface IObjectCategory {
  [key: string]: {
    _id: string;
    parent_id: string | null;
    childrens: string[];
    slug: string;
    title: string;
  };
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
  IObjectCategory,
  IBreadcrumbCategory,
  ICategoryTable,
};

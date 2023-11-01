interface IThumbnailUrl {
  source: FileList | {};
  url: string;
}

interface IOption {
  title: string;
}

interface IBreadcrumb {
  label: String;
  url_path: String;
}

interface IParentCategory {
  _id: string;
  title: string
}

interface IDataCategory {
  _id?: string | null;
  parent_id: IParentCategory | null;
  childrens?: string[];
  title: string;
  description: string;
  slug?: string | null;
  meta_title?: string;
  meta_description?: string;
  public: boolean;
  thumbnail: string | null;
  breadcrumbs?: IBreadcrumb[];
  createdAt?: string;
}

interface ICategorySelect {
  title: string | null;
  node_id: string | null;
}

export type { IThumbnailUrl, IOption, IDataCategory, ICategorySelect };

interface IThumbnailUrl {
  source: FileList | {};
  url: string;
}

interface IOption {
  title: string;
}

interface IDataCategory {
  _id?: string | null;
  slug?: string;
  title: string;
  description: string;
  thumbnail: string;
  options: IOption[];
  createdAt?: string;
}

export type { IThumbnailUrl, IOption, IDataCategory };

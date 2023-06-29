interface IThumbnailUrl {
  source: FileList | {};
  url: string;
}

interface IOption {
  title: string;
}

interface IDataCategory {
  id?: string | null;
  title: string;
  description: string;
  thumbnail: string;
  options: IOption[];
}

export type { IThumbnailUrl, IOption, IDataCategory };

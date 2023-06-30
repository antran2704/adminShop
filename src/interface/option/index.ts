interface IOptionItem {
  _id: string;
  title: string;
}

interface IOption {
  _id: string;
  list: IOptionItem[];
}

export type { IOption, IOptionItem };

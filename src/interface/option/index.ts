interface IOptionItem {
  _id: string;
  title: string;
}

interface IOption {
  _id: string;
  list: IOptionItem[];
}

interface IOptionCancle {
  id: string;
  lable: string;
  value: string;
}

export type { IOption, IOptionItem, IOptionCancle };

import { ISelectItem } from "../Select";

interface IVariant {
  _id: string;
  name: string;
  public: boolean;
}

type INewVariant = Omit<IVariant, "_id">

interface IAttribute {
  _id?: string;
  code: string;
  name: string;
  variants?: IVariant[] | ISelectItem[];
  public: boolean;
  createdAt?: string;
  updateAt?: string;
}

export type { IVariant, IAttribute, INewVariant };

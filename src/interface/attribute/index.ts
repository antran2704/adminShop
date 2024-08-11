import { ISearch } from "../queryParams";

interface IVariant {
  _id: string;
  name: string;
  public: boolean;
}

type INewVariant = Omit<IVariant, "_id">;

interface IAttribute {
  _id: string;
  code: string;
  name: string;
  children: IVariant[];
  public: boolean;
  createdAt?: string;
  updateAt?: string;
}

interface ISendAttribute {
  code: string;
  name: string;
  variants: Omit<IVariant, "_id">[];
  public: boolean;
}

interface ISearchAttribute extends ISearch {
  public?: boolean;
}

export type {
  IVariant,
  IAttribute,
  INewVariant,
  ISendAttribute,
  ISearchAttribute,
};

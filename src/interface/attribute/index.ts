import { ISearch } from "../queryParams";

interface IAttributeChild {
  _id: string;
  name: string;
  public: boolean;
  createdAt: string;
}

type INewAttributeChild = Omit<IAttributeChild, "_id" | "createdAt">;

interface IAttribute {
  _id: string;
  code: string;
  name: string;
  // children: IAttributeChild[];
  public: boolean;
  createdAt: string;
}

interface ICreateAttibute {
  code: string;
  name: string;
  // children: INewAttributeChild[];
  public: boolean;
}

interface IUpdateAttibute {
  code: string;
  name: string;
  public: boolean;
}

interface IFormAttibute {
  code: string;
  name: string;
  children: string[];
  public: boolean;
}

interface IAttributeTable {
  key: string;
  _id: string;
  code: string;
  title: string;
  public: boolean;
  createdAt: string;
}

interface IAttributeChildTable {
  key: string;
  _id: string;
  title: string;
  public: boolean;
  createdAt: string;
}

interface ISearchAttribute extends ISearch {
  public?: string;
}

export type {
  IAttributeChild,
  IAttribute,
  INewAttributeChild,
  IAttributeTable,
  IAttributeChildTable,
  ICreateAttibute,
  IUpdateAttibute,
  IFormAttibute,
  ISearchAttribute,
};

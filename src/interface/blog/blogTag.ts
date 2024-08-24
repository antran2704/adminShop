import { STATUS_PARAMATER_ENUM } from "~/enums";
import { ISearch } from "../queryParams";

interface IBlogTag {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  public: boolean;
  createdAt: string;
}

interface ICreateBlogTag {
  title: string;
  thumbnail: string;
  public: boolean;
}

interface IBlogTagTable {
  key: string;
  id: string;
  title: string;
  image: string;
  public: boolean;
  createdAt: string;
}

interface IBlogTagSearch extends ISearch {
  status?: STATUS_PARAMATER_ENUM;
}

export type { IBlogTag, ICreateBlogTag, IBlogTagTable, IBlogTagSearch };

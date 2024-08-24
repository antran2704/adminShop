import { IUserInfor } from "../user";
import { IBlogTag } from "./blogTag";

type AuthorBlog = Pick<IUserInfor, "_id" | "name">;

type TagBlogUpdate = {
  tag: string;
  slug: string;
};

interface IBlog {
  _id: string;
  author: AuthorBlog;
  title: string;
  description: string;
  meta_title: string;
  meta_description: string;
  content: string;
  thumbnail: string;
  slug: string;
  tag: IBlogTag;
  tags: IBlogTag[];
  public: boolean;
  createdAt: string;
}

interface ICreateBlog {
  title: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  content: string;
  thumbnail: string;
  tag: string;
  tags: string[];
  public: boolean;
}

interface IBlogTable {
  id: string;
  key: string;
  title: string;
  image: string;
  public: boolean;
  createdAt: string;
}

export type { IBlog, AuthorBlog, TagBlogUpdate, ICreateBlog, IBlogTable };

import { ITagBlog } from "../tagBlog";
import { IUserInfor } from "../user";

interface IBlog {
  _id: string;
  author: AuthorBlog;
  title: string;
  thumbnail: string;
  slug: string;
  tags: TagBlog[];
  public: boolean;
  updatedAt: string;
}

type ICreateBlog = Omit<IBlog, "_id" | "updatedAt">

type AuthorBlog = Pick<IUserInfor, "_id" | "name">;

type TagBlog = Pick<ITagBlog, "_id" | "slug" | "title">;

export type { IBlog, AuthorBlog, TagBlog, ICreateBlog };

import { ITagBlog } from "../tagBlog";
import { IUserInfor } from "../user";

type AuthorBlog = Pick<IUserInfor, "_id" | "name">;
type TagBlog = Pick<ITagBlog, "_id" | "slug" | "title">;

interface IBlog {
  _id: string;
  author: AuthorBlog;
  title: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  content: string;
  thumbnail: string;
  slug: string;
  tags: TagBlog[];
  public: boolean;
  updatedAt: string;
}

type IHomeBlog = Omit<IBlog, "meta_title" | "meta_description" | "content">;

type ICreateBlog = Omit<
  IBlog,
  "_id" | "updatedAt" | "author" | "slug" | "meta_title" | "meta_description"
>;

export type { IBlog, AuthorBlog, TagBlog, ICreateBlog, IHomeBlog };

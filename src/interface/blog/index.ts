import { ITagBlog } from "../tagBlog";
import { IUserInfor } from "../user";

type AuthorBlog = Pick<IUserInfor, "_id" | "name">;

type TagBlog = {
  tag: {
    _id: string;
    title: string;
    slug: string;
  };
  slug: string;
};

type TagBlogUpdate = {
  tag: string;
  slug: string;
};

interface IBlog {
  _id: string;
  author: AuthorBlog | null;
  title: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  content: string;
  thumbnail: string;
  slug: string;
  tags: TagBlog[];
  public: boolean;
  updatedAt?: string;
}

type IHomeBlog = Omit<IBlog, "meta_title" | "meta_description" | "content">;

type ICreateBlog = Pick<
  IBlog,
  | "title"
  | "meta_title"
  | "description"
  | "thumbnail"
  | "meta_description"
  | "content"
  | "public"
> & {
  tags: TagBlogUpdate[];
  author: string;
};

export type { IBlog, AuthorBlog, TagBlog, TagBlogUpdate, ICreateBlog, IHomeBlog };

interface ITagBlog {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  public: boolean;
  updatedAt?: string;
}

type ICreateTagBlog = Omit<ITagBlog, "_id" | "updatedAt" | "slug">;

export type { ITagBlog, ICreateTagBlog };

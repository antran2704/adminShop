interface ITagBlog {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  public: boolean;
  updatedAt: string;
}

type ICreateBlog = Omit<ITagBlog, "_id" | "updatedAt">;

export type { ITagBlog, ICreateBlog };

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

export type { IBlogTag, ICreateBlogTag, IBlogTagTable };

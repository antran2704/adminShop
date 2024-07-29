interface IBanner {
  _id: string;
  title: string;
  meta_title: string;
  image: string;
  path: string | null;
  public: boolean;
  createdAt: string;
  updateAt?: string;
}

interface IBannerTable {
  key: string;
  bannerId: string;
  title: string;
  image: string;
  public: boolean;
  createdAt: string;
}

type ICreateBanner = Omit<IBanner, "_id" | "createdAt" | "updateAt">;

export type { IBanner, ICreateBanner, IBannerTable };

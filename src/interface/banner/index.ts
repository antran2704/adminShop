interface Banner {
  _id: string;
  title: string;
  meta_title: string;
  image: string;
  path: string | null;
  isPublic: boolean;
  createdAt?: string;
  updateAt?: string;
}

type CreateBanner = Omit<Banner, "_id" | "createdAt" | "updateAt">;

export type { Banner, CreateBanner };

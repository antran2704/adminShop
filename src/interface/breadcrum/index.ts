interface IBreadcrumb {
  [node_id: string]: {
    _id: string;
    parent_id: string | null;
    title: string;
  };
}

export type { IBreadcrumb };

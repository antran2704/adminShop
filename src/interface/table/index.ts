import { typeCel } from "~/enums";

interface IDataCelTable {
  type: typeCel;
  value: string;
}
interface IDataTable {
  _id: string | null;
  parent_id?: string;
  childrens?: string[];
  title: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  publish: boolean;
  thumbnail: string;
  breadcrumbs?: string;
  createdAt: string;
}


export type { IDataTable, IDataCelTable };

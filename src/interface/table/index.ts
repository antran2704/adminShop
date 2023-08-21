import { typeCel } from "~/enums";

interface IDataCelTable {
  type: typeCel;
  value: string;
}
interface IDataTable {
  _id: string | null;
  title: string;
  slug: string;
  thumbnail: string;
  createdAt: string;
}


export type { IDataTable, IDataCelTable };

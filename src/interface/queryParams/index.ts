import { ORDER_PARAMATER_ENUM } from "~/enums";

export type IQueryParam<T> = {
  [key in keyof T]: string;
};

interface ISearch {
  page: number;
  take: number;
  order: ORDER_PARAMATER_ENUM;
}

export type { ISearch };

import { IPagination } from "../pagination";

interface IResponse<T> {
  status: number;
  payload: T;
}

interface IResponseWithPagination<T> {
  status: number;
  payload: T;
  pagination: IPagination;
}

export type { IResponse, IResponseWithPagination };

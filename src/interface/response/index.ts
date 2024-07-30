import { IPagination } from "../pagination";

interface ErrorResponse {
  message: string;
  status: number;
}

interface IResponse<T> {
  status: number;
  payload: T;
}

interface IResponseWithPagination<T> {
  status: number;
  payload: T;
  pagination: IPagination;
}

export type { IResponse, IResponseWithPagination, ErrorResponse };

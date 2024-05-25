interface IResponseSuccess<T> {
  status: number;
  payload: T;
}

interface IResponseError {
  status: number;
  message: string;
}

interface AxiosRequestHeadersCus {
  [key: string]: string;
}

export type { IResponseSuccess, AxiosRequestHeadersCus, IResponseError };

interface IResponse<T> {
  status: number;
  payload: T;
}

export type { IResponse };

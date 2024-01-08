export type IQueryParam<T> = {
  [key in keyof T]: string;
};

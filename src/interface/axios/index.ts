interface AxiosResponseCus {
  status: number;
  data: any;
}

interface AxiosRequestHeadersCus {
  [key: string]: string;
}

export type { AxiosResponseCus, AxiosRequestHeadersCus };

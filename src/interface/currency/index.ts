interface ICurrency {
  symbol: string;
  locale: string;
  calc: (value: number) => number;
}

export type { ICurrency };

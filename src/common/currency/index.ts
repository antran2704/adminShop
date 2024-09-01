import { ICurrency } from "~/interface";

const CURRENCY: { [k: string]: ICurrency } = {
  vi: {
    symbol: "VND",
    locale: "en-GB",
    calc: (value: number) => {
      return value;
    },
  },
  en: {
    symbol: "USD",
    locale: "en-IN",
    calc: (value: number) => {
      return value / 25 / 1000;
    },
  },
};

export default CURRENCY;

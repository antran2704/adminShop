import { ICurrency } from "~/interface";

const CURRENCY: { [k: string]: ICurrency } = {
  vi: {
    symbol: "VND",
    locale: "en-GB",
    calc: (value) => {
      return value;
    },
  },
  en: {
    symbol: "USD",
    locale: "en-IN",
    calc: (value) => {
      return value / 25 / 1000;
    },
  },
};

export default CURRENCY;

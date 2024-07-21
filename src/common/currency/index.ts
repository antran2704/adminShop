import { ICurrency } from "~/interface";

const CURRENCY: { [k: string]: ICurrency } = {
  vi: {
    symbol: "VND",
    rate: 1,
  },
  en: {
    symbol: "USD",
    rate: 25.315,
  },
};

export default CURRENCY;

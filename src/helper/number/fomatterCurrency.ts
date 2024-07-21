const formatBigNumber = (
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
) => {
  return new Intl.NumberFormat(locale, options).format(value);
};

const revertPriceToString = (value: string) => {
  if (typeof value !== "string") return;

  return value.split(".").join("");
};

export { formatBigNumber, revertPriceToString };

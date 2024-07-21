const formatBigNumber = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

const revertPriceToString = (value: string) => {
  if (typeof value !== "string") return;

  return value.split(".").join("");
};

export { formatBigNumber, revertPriceToString };

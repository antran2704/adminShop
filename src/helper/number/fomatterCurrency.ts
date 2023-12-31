const formatBigNumber = (value: number) => {
  return new Intl.NumberFormat("de-DE").format(value);
}

const revertPriceToString = (value: string) => {
  if (typeof value !== "string") return;

  return value.split(".").join("");
};

export { formatBigNumber, revertPriceToString };

const convertToCamelCase = (str: string, character: string = "_"): string => {
  return str
    .toLowerCase()
    .split(character)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
};

const checkValidNumber = (value: number): boolean => {
  const regexNumber = /^[0-9]*\.?[0-9]*$/;

  return Boolean(regexNumber.test(value.toString()));
};

const formatBigNumber = (
  value: number,
  locale: string = "de-DE",
  options?: Intl.NumberFormatOptions,
) => {
  return new Intl.NumberFormat(locale, options).format(value);
};
const revertBigNumberToString = (value: string) => {
  if (typeof value !== "string") return;

  return value.split(".").join("").split(",").join("");
};

export {
  checkValidNumber,
  formatBigNumber,
  revertBigNumberToString,
  convertToCamelCase,
};

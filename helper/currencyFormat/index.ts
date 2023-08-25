const currencyFormat = (number: Number): String => {
  return number.toLocaleString("vi-VN");
};

const parseCurrency = (text: String): Number => {
    return Number(text);
}

export {currencyFormat, parseCurrency};
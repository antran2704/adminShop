const getDateTime = (timestamps: string) => {
  const date = new Date(timestamps);
  return date.toLocaleDateString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const getFirstDayInWeek = (value: string) => {
  const firstDay = new Date(value);
  const day = firstDay.getDay();
  firstDay.setDate(firstDay.getDate() - day + (day === 0 ? -6 : 1));
  return firstDay;
};

const getEndDayInWeek = (value: string) => {
  const endDay = new Date(value);
  endDay.setDate(endDay.getDate() - endDay.getDay() + 7);
  return endDay;
};


export { getDateTime, getFirstDayInWeek, getEndDayInWeek };

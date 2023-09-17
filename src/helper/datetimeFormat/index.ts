const getDateTime = (timestamps: string) => {
  const date = new Date(timestamps);
  return date.toLocaleDateString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

export { getDateTime };

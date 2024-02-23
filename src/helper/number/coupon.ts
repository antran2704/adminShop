const getValueCoupon = (
  subTotal: number,
  couponValue: number,
  couponType: string
) => {
  if (couponType === "percentage") {
    return (subTotal * couponValue) / 100;
  } else {
    return couponValue;
  }
};

export { getValueCoupon };

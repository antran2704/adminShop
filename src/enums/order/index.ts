/* eslint-disable no-unused-vars */
export enum MethodPayment {
  Cash = "cash",
  Banking = "banking",
  Cod = "cod",
  VNPay = "vnpay",
}

export enum PaymentStatus {
  pending = "pending",
  success = "success",
  cancle = "cancle",
}

export enum ORDER_STATUS_ENUM {
  PENDING = "PENDING",
  PROCESS = "PROCESS",
  SHIPPING = "SHIPPING",
  SUCCESS = "SUCCESS",
  CANCEL = "CANCEL",
}

export enum PAYMENT_STATUS_ENUM {
  CHECKING = "CHECKING",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}

export enum PROCESS_ORDER_ENUM {
  ORDER_TIME = "ORDER_TIME",
  PAYMENT_TIME = "PAYMENT_TIME",
  SHIP_TIME = "SHIP_TIME",
  COMPLETED_TIME = "COMPLETED_TIME",
  CANCEL_TIME = "CANCEL_TIME",
}

export enum PAYMENT_METHOD_ENUM {
  COD = "COD",
  CARD = "CARD",
  CASH = "CASH",
  VNPAY = "VNPAY",
  BANKING = "BANKING",
}

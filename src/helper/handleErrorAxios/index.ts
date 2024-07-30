import axios from "axios";
import { ErrorResponse } from "~/interface";

const hanldeErrorAxios = (
  err: unknown,
): Pick<ErrorResponse, "message" | "status"> => {
  if (!axios.isAxiosError(err)) {
    return { message: "Internal Server", status: 500 };
  }

  const response = err.response;

  if (!response) {
    return { message: "Internal Server", status: 500 };
  }

  return response.data;
};

export default hanldeErrorAxios;

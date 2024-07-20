import httpConfig from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getGrossInWeek = async (startDate: Date) => {
  return await httpConfig
    .get(BASE_URL + `/admin/gross/day/week?startDate=${startDate}`)
    .then((res) => res.data);
};

const getGross = async (date: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/gross/day?date=${date}`)
    .then((res) => res.data);
};

export { getGrossInWeek, getGross };

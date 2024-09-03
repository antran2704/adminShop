import httpConfig from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getGrossInMonth = async (startDate: string, endDate: string) => {
  return await httpConfig
    .get(
      BASE_URL +
        `/admin/gross/day/month?startDate=${startDate}&endDate=${endDate}`,
    )
    .then((res) => res.data);
};

const getStatisticsMonth = async (month: string, year: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/gross/month?month=${month}&year=${year}`)
    .then((res) => res.data);
};

export { getGrossInMonth, getStatisticsMonth };

import httpConfig from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getGrossInYear = async (year: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/gross/month/year?year=${year}`)
    .then((res) => res.data);
};

const getStatisticsYear = async (year: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/gross/year?year=${year}`)
    .then((res) => res.data);
};

export { getGrossInYear, getStatisticsYear };

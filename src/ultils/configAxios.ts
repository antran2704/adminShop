import axios from "axios";

const httpConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT_API,
});

const axiosGet = async (path: string) => {
  try {
    const payload = await httpConfig.get(path);
    return payload.data;
  } catch (error) {
    console.error(error);
  }
};

const axiosPost = async <T>(path: string, data: T) => {
  try {
    const payload = await httpConfig.post(path, data);

    return payload.data;
  } catch (error) {
    console.error(error);
  }
};

const axiosPatch = async <T>(path: string, data: T) => {
  try {
    const payload = await httpConfig.patch(path, data );

    return payload.data;
  } catch (error) {
    console.error(error);
  }
};

const axiosDelete = async (path: string) => {
  try {
    const payload = await httpConfig.delete(path);

    return payload.data;
  } catch (error) {
    console.error(error);
  }
};

export { axiosGet, axiosPatch, axiosPost, axiosDelete };

import { IAttribute, IFilter, ISendAttribute } from "~/interface";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/ultils/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getAttributes = async (page: number = 1) => {
  return await axiosGet(BASE_URL + `/attributes?page=${page}`);
};

const getChildAttributes = async (attribute_id: string) => {
  return await axiosGet(BASE_URL + `/attributes/${attribute_id}`);
};

const getAttributesAvailable = async () => {
  return await axiosGet(BASE_URL + `/attributes/available`);
};

const getAttributesWithFilter = async (
  filter: IFilter | null,
  page: number = 1
) => {
  return await axiosGet(
    BASE_URL + `/attributes/search?search=${filter?.search || ""}&page=${page}`
  );
};

const updateAttribute = async (
  attribute_id: string,
  options?: Partial<IAttribute>
) => {
  return await axiosPatch(BASE_URL + `/attributes/${attribute_id}`, {
    ...options,
  });
};

const updateChildAttribute = async (
  attribute_id: string,
  children_id: string,
  data: any
) => {
  return await axiosPatch(BASE_URL + `/attributes/child/${attribute_id}`, {
    children_id,
    ...data,
  });
};

const createdAttribute = async (data: ISendAttribute) => {
  return await axiosPost(BASE_URL + "/attributes", data);
};

const createChildAttribute = async (attribute_id: string, data: any) => {
  return await axiosPost(BASE_URL + `/attributes/child/${attribute_id}`, data);
};

const deleteAttribute = async (attribute_id: string) => {
  return await axiosDelete(BASE_URL + `/attributes/${attribute_id}`);
};

const deleteChildAttribute = async (
  attribute_id: string,
  children_id: string
) => {
  return await axiosPatch(BASE_URL + `/attributes/child/delete`, {
    parent_id: attribute_id,
    children_id,
  });
};

export {
  getAttributes,
  getChildAttributes,
  getAttributesAvailable,
  getAttributesWithFilter,
  updateAttribute,
  updateChildAttribute,
  createdAttribute,
  createChildAttribute,
  deleteAttribute,
  deleteChildAttribute,
};

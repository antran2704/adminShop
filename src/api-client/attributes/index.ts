import qs from "qs";

import {
  IAttribute,
  IFilter,
  ISearchAttribute,
  ISendAttribute,
} from "~/interface";
import httpConfig, {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getAttributes = async (paramater: ISearchAttribute) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await httpConfig
    .get(BASE_URL + `/admin/attributes?${parseParameters}`)
    .then((res) => res.data);
};

const getChildAttributes = async (attribute_id: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/attributes/${attribute_id}`)
    .then((res) => res.data);
};

const getAttributesAvailable = async () => {
  return await httpConfig
    .get(BASE_URL + `/admin/attributes/available`)
    .then((res) => res.data);
};

const getAttributesWithFilter = async (
  filter: IFilter | null,
  page: number = 1,
) => {
  return await axiosGet(
    BASE_URL + `/attributes/search?search=${filter?.search || ""}&page=${page}`,
  );
};

const updateAttribute = async (
  attribute_id: string,
  options?: Partial<IAttribute>,
) => {
  return await axiosPatch(BASE_URL + `/attributes/${attribute_id}`, {
    ...options,
  });
};

const updateChildAttribute = async (
  attribute_id: string,
  children_id: string,
  data: any,
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
  children_id: string,
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

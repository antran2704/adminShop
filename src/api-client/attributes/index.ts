import qs from "qs";

import {
  IAttribute,
  ICreateAttibute,
  ISearchAttribute,
  IUpdateAttibute,
} from "~/interface";
import httpConfig from "~/configs/configAxios";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getAttributes = async (paramater: ISearchAttribute) => {
  const parseParameters = qs.stringify(paramater, {
    filter: (_, value) => value || undefined,
  });

  return await httpConfig
    .get(BASE_URL + `/admin/attributes?${parseParameters}`)
    .then((res) => res.data);
};

const getAttribute = async (attributeId: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/attributes/${attributeId}`)
    .then((res) => res.data);
};

const getChildAttributes = async (attribute_id: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/attributes/child/${attribute_id}`)
    .then((res) => res.data);
};

const getAttributesAvailable = async () => {
  return await httpConfig
    .get(BASE_URL + `/admin/attributes/available`)
    .then((res) => res.data);
};

const createdAttribute = async (data: ICreateAttibute) => {
  return await httpConfig
    .post(BASE_URL + "/admin/attributes", data)
    .then((res) => res.data);
};

const updateAttribute = async (attribute_id: string, data: IUpdateAttibute) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/${attribute_id}`, {
      ...data,
    })
    .then((res) => res.data);
};

const activeAttribute = async (attribute_id: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/${attribute_id}/active`)
    .then((res) => res.data);
};

const disableAttribute = async (attribute_id: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/${attribute_id}/disable`)
    .then((res) => res.data);
};

const updateChildAttribute = async (
  attribute_id: string,
  children_id: string,
  data: any,
) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/child/${attribute_id}`, {
      children_id,
      ...data,
    })
    .then((res) => res.data);
};

const createChildAttribute = async (attribute_id: string, data: any) => {
  return await httpConfig
    .post(BASE_URL + `/admin/attributes/child/${attribute_id}`, data)
    .then((res) => res.data);
};

const deleteAttribute = async (attribute_id: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/attributes/${attribute_id}`)
    .then((res) => res.data);
};

const deleteChildAttribute = async (
  attribute_id: string,
  children_id: string,
) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/child/delete`, {
      parent_id: attribute_id,
      children_id,
    })
    .then((res) => res.data);
};

export {
  getAttributes,
  getAttribute,
  getChildAttributes,
  getAttributesAvailable,
  updateAttribute,
  activeAttribute,
  disableAttribute,
  updateChildAttribute,
  createdAttribute,
  createChildAttribute,
  deleteAttribute,
  deleteChildAttribute,
};

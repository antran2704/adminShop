import {
  ICreateAttibute,
  INewAttributeChild,
  ISearch,
  ISearchAttribute,
  IUpdateAttibute,
} from "~/interface";
import httpConfig from "~/configs/configAxios";
import { parseQueryString } from "~/helper/url";

const BASE_URL: string = process.env.NEXT_PUBLIC_ENDPOINT_API as string;

const getAttributes = async (paramater: ISearchAttribute) => {
  const parseParameters = parseQueryString(paramater);

  return await httpConfig
    .get(BASE_URL + "/admin/attributes" + parseParameters)
    .then((res) => res.data);
};

const getAttribute = async (attributeId: string) => {
  return await httpConfig
    .get(BASE_URL + `/admin/attributes/${attributeId}`)
    .then((res) => res.data);
};

const getChildAttributes = async (attributeId: string, paramater: ISearch) => {
  const parseParameters = parseQueryString(paramater);

  return await httpConfig
    .get(BASE_URL + `/admin/attributes/child/${attributeId}` + parseParameters)
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

const updateAttribute = async (attributeId: string, data: IUpdateAttibute) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/${attributeId}`, {
      ...data,
    })
    .then((res) => res.data);
};

const activeAttribute = async (attributeId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/${attributeId}/active`)
    .then((res) => res.data);
};

const disableAttribute = async (attributeId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/${attributeId}/disable`)
    .then((res) => res.data);
};

const activeChildAttribute = async (childId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/child/${childId}/active`)
    .then((res) => res.data);
};

const disableChildAttribute = async (childId: string) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/child/${childId}/disable`)
    .then((res) => res.data);
};

const createChildAttribute = async (
  attributeId: string,
  data: INewAttributeChild,
) => {
  return await httpConfig
    .post(BASE_URL + `/admin/attributes/child/${attributeId}`, data)
    .then((res) => res.data);
};

const updateChildAttribute = async (
  childId: string,
  data: INewAttributeChild,
) => {
  return await httpConfig
    .patch(BASE_URL + `/admin/attributes/child/${childId}`, data)
    .then((res) => res.data);
};

const deleteAttribute = async (attributeId: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/attributes/${attributeId}`)
    .then((res) => res.data);
};

const deleteChildAttribute = async (childId: string) => {
  return await httpConfig
    .delete(BASE_URL + `/admin/attributes/child/${childId}`)
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
  activeChildAttribute,
  disableChildAttribute,
  updateChildAttribute,
  createdAttribute,
  createChildAttribute,
  deleteAttribute,
  deleteChildAttribute,
};

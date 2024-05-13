import {PAGE_SIZE} from 'src/utilities/constants';
import apiPrefix from './apiPrefix';
import axiosInstance from './axios';

const changeLanguageRequest = data => {
  return axiosInstance.put(`${apiPrefix.CHANGE_LANGUAGE}`, data);
};

//BẢN TIN CƯ DÂN
const getListNewsletter = ({
  projectId,
  towerId,
  zoneId,
  page = 1,
  page_size = PAGE_SIZE,
  query = '1=1',
  order_by = '',
}) => {
  return axiosInstance.get(
    `${
      apiPrefix.GET_LIST_NEWS_LETTER
    }/${projectId}/${towerId}/${zoneId}?page=${page}&page_size=${page_size}&query=${
      query || '1=1'
    }&order_by${order_by}`,
  );
};

//BẢN TIN CƯ DÂN CHI TIẾT
const getDetailNewsletter = ({newId}) => {
  return axiosInstance.get(`${apiPrefix.GET_DETAIL_NEWS_LETTER}/${newId}`);
};

const getDetailBanner = ({bannerId}) => {
  return axiosInstance.get(`${apiPrefix.DETAIL_BANNER}/${bannerId}`);
};

//TIN TUC
const getListNews = ({
  projectId,
  towerId,
  zoneId,
  page = 1,
  page_size = PAGE_SIZE,
  query = '1=1',
  order_by = '',
}) => {
  return axiosInstance.get(
    `${
      apiPrefix.GET_LIST_NEWS
    }/${projectId}/${towerId}/${zoneId}?page=${page}&page_size=${page_size}&query=${
      query || '1=1'
    }&order_by${order_by}`,
  );
};

const getListBanner = ({projectId, towerId, zoneId}) => {
  return axiosInstance.get(
    `${apiPrefix.GET_LIST_BANNER}/${projectId}/${towerId}/${zoneId}`,
  );
};

const getNoteBookCategory = ({projectId, towerId, zoneId}) => {
  return axiosInstance.get(
    `${apiPrefix.GET_HAND_LIST_CATEGORY}/${projectId}/${towerId}/${zoneId}?page=1&page_size=10&query=1=1&order_by`,
  );
};

const getDetailNoteBook = ({projectId, towerId, zoneId, idc}) => {
  return axiosInstance.get(
    `${apiPrefix.GET_HAND_LIST}/${projectId}/${towerId}/${zoneId}/${idc}?page=1&page_size=10&query=1=1&order_by`,
  );
};

const updateUserInfo = params => {
  return axiosInstance.put(`${apiPrefix.UPDATE_USER_INFO}`, params);
};

const updateUserAvatar = () => {
  return axiosInstance.post(`${apiPrefix.UPDATE_AVATAR}`);
};

const getHotline = ({projectId, towerId, zoneId}) => {
  return axiosInstance.get(
    `${apiPrefix.HOTLINE}/${projectId}/${towerId}/${zoneId}`,
  );
};

const getListQuestion = ({projectId, towerId, zoneId}) => {
  return axiosInstance.get(
    `${apiPrefix.QUESTION}/${projectId}/${towerId}/${zoneId}?page=1&page_size=10&query=1=1&order_by`,
  );
};

const getListApart = ({userId}) => {
  return axiosInstance.get(
    `${apiPrefix.GET_LIST_APART}/${userId}?page=1&page_size=100&query=1=1&order_by`,
  );
};

const getDetailApart = ({residentId, apartmentId}) => {
  return axiosInstance.get(
    `${apiPrefix.GET_DETAIL_APART}/${residentId}/${apartmentId}`,
  );
};

const getVersionConfig = () => {
  return axiosInstance.get(`${apiPrefix.VERSION_CONFIG}`);
};

const getLangConfig = () => {
  return axiosInstance.get(`${apiPrefix.LANG_CONFIG}`);
};

const getAppViewConfig = ({idProject, idTower}) => {
  return axiosInstance.get(
    `${apiPrefix.APPVIEW_CONFIG}/${idProject}/${idTower}`,
  );
};

export {
  changeLanguageRequest,
  getListNewsletter,
  getDetailNewsletter,
  getDetailNoteBook,
  getNoteBookCategory,
  updateUserInfo,
  updateUserAvatar,
  getListNews,
  getHotline,
  getListQuestion,
  getListApart,
  getListBanner,
  getDetailApart,
  getDetailBanner,
  getVersionConfig,
  getLangConfig,
  getAppViewConfig,
};

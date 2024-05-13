import {PAGE_SIZE} from 'src/utilities/constants';

const {default: apiPrefix} = require('./apiPrefix');
const {default: axiosInstance} = require('./axios');

const getListNoti = ({
  userId,
  page = 1,
  page_size = PAGE_SIZE,
  QueryString = '',
  IsRead,
}) => {
  let url = `${apiPrefix.GET_LIST_NOTI}?UserId=${userId}&page=${page}&page_size=${page_size}`;

  if (QueryString) {
    url += `&QueryString=${QueryString}`;
  }
  if (typeof IsRead === 'boolean') {
    url += `&IsRead=${IsRead}`;
  }

  return axiosInstance.get(url);
};

const pushTokenFcm = data => {
  return axiosInstance.post(`${apiPrefix.PUSH_TOKEN}`, data);
};

const deleteTokenFcm = data => {
  return axiosInstance.delete(`${apiPrefix.PUSH_TOKEN}`, {data});
};

export {getListNoti, pushTokenFcm, deleteTokenFcm};
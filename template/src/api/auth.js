import apiPrefix from './apiPrefix';
import axiosInstance from './axios';

const loginApi = data => {
  return axiosInstance.post(apiPrefix.LOGIN, data);
};

const sendRegisterRequest = data => {
  return axiosInstance.post(apiPrefix.SEND_REGISTER_REQUEST, data);
};

const resendRegisterCode = phoneNumber => {
  return axiosInstance.put(`${apiPrefix.SEND_OTP_REGISTER}/${phoneNumber}`);
};

const verifyOTP = ({id, code}) => {
  return axiosInstance.put(`${apiPrefix.VERIFY_OTP}/${id}/${code}`);
};

const createNewPass = data => {
  return axiosInstance.put(`${apiPrefix.CREATE_NEW_PASS}/${data.userId}`, data);
};

const sendChangePassRequest = phoneNumber => {
  return axiosInstance.post(`${apiPrefix.SEND_OTP_FORGOT_PASS}/${phoneNumber}`);
};

const activeApartmentRequest = ({id, qrCode}) => {
  return axiosInstance.put(`${apiPrefix.ACITVE_APARTMENT}/${id}/${qrCode}`);
};

const sendChangePassCode = phoneNumber => {
  return axiosInstance.put(`${apiPrefix.SEND_OTP_FORGOT_PASS}/${phoneNumber}`);
};

const changePassword = data => {
  return axiosInstance.put(`${apiPrefix.CHANGE_PASSWORD}/${data.userId}`, data);
};

const deleteAccount = ({userId, apartId}) => {
  return axiosInstance.delete(
    `${apiPrefix.DELETE_ACCOUNT}/${userId}/${apartId}`,
  );
};

export {
  loginApi,
  sendRegisterRequest,
  resendRegisterCode,
  verifyOTP,
  createNewPass,
  sendChangePassRequest,
  activeApartmentRequest,
  sendChangePassCode,
  changePassword,
  deleteAccount,
};

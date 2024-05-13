import axios from 'axios';
import {AxiosConfig} from '../utilities/constants';
import {store} from '../store';
import {Alert} from 'react-native';
import {t} from 'i18next';
import apiPrefix from './apiPrefix';
import {refLoadingCpn} from 'src/routes';
import {showAlertCustomResponse} from 'src/utilities/helper/functional';
import {logoutAction} from 'src/store/auth';
import {deleteTokenFcm} from './noti';
import {deleteTokenSchema} from './schema/otherSchema';

const axiosInstance = axios.create({
  baseURL: AxiosConfig.BASE_URL,
  timeout: AxiosConfig.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const logRequest = request => {
  // if (!__DEV__) return;
  // if (console.group) {
  //   console.group(
  //     '%cAPI Request',
  //     'color:white;font-weight:bold;background:#0194ff;padding:2px 6px',
  //     request.url,
  //   );
  // }
  // console.log('HTTP Method\t\t', request.method);
  // console.log('Endpoint\t\t', request.url);
  // if (request.data) {
  //   console.log('Request Body\t', request.data);
  // }
  // console.log('AXIOS Request\t', request);
  // // @ts-ignore
  // if (console.groupEnd) {
  //   // @ts-ignore
  //   console.groupEnd();
  // }
};

const logResponse = response => {
  // if (!__DEV__) return;
  // if (console.group) {
  //   console.group(
  //     '%cAPI Response',
  //     'color:white;font-weight:bold;background:green;padding:2px 6px',
  //     response.config.url,
  //   );
  // }
  // console.log('HTTP Method\t\t', response.config.method);
  // console.log('Endpoint\t\t', response.config.url);
  // if (response.config.data) {
  //   console.log('Request Body\t', response.config.data);
  // }
  // if (response.data) {
  //   console.log('Response Body\t', response.data);
  // }
  // console.log('AXIOS Response\t', response);
  // if (console.groupEnd) {
  //   console.groupEnd();
  // }
};

const logError = (
  apiName = '',
  error = {
    config: {method: {toUpperCase: () => {}}, url: '', data: ''},
    data: {},
  },
) => {
  // if (!__DEV__) return;
  // if (console.group) {
  //   console.group(
  //     '%cAPI Response',
  //     'color:white;font-weight:bold;background:red;padding:2px 6px',
  //     apiName,
  //   );
  // }
  // console.log('HTTP Method\t\t', error?.config?.method?.toUpperCase());
  // console.log('Endpoint\t\t', error?.config?.url);
  // console.log('Request Body\t', error?.config?.data);
  // console.log('Response Body\t', error?.data);
  // console.log('AXIOS Error\t', error);
  // if (console.groupEnd) {
  //   console.groupEnd();
  // }
};

// let isAlerted = false;

const handlingErrors = error => {
  console.log('handlingErrors', error);
  if (axios.isCancel(error)) {
    return Promise.reject({
      status: AxiosConfig.REQUEST_STATUS_CODE.CANCEL_REQUEST_ERROR,
      message: 'Request Canceled',
    });
  }
  // const _ignore = ['me/refresh-token', 'auth/login', 'user/forgot-password'];
  // if (
  //   error?.response?.status === 401 &&
  //   _ignore.findIndex(_e => _e === error?.config?.url) === -1
  // ) {
  //   if (!isAlerted) {
  //     isAlerted = true;
  //     Alert.alert(null, error?.response?.data?.message, [
  //       {
  //         onPress: () => {
  //           store.dispatch(LogoutRequestAction());
  //           isAlerted = false;
  //         },
  //         text: 'Ok',
  //       },
  //     ]);
  //   }
  //   return Promise.reject(error);
  // }
  let message = error.message;
  let status = error.response.status;
  let data = error.response.data;

  return handleAlertError(message);
  // try {

  //   if (error.response) {
  //     if (error.response.data && typeof error.response.data === 'object') {
  //       status = error.response.status || error.response.data.errorCode;
  //       message =
  //         error.response.data.message ||
  //         error.response.data.resultMsg ||
  //         'Có lỗi xảy ra.';
  //       data = error.response.data;
  //     } else {
  //       message = error.response.statusText;
  //       status = error.response.status;
  //     }
  //   } else {
  //     if (error.request) {
  //       // The request was made but no response was received
  //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
  //       status = AxiosConfig.REQUEST_STATUS_CODE.UNKNOWN_ERROR;
  //       message = `${error.message || 'Có lỗi xảy ra.'}`;
  //       if (
  //         error.code === 'ECONNABORTED' ||
  //         error.message === 'Network Error'
  //       ) {
  //         status = AxiosConfig.REQUEST_STATUS_CODE.INTERNET_ERROR;
  //         message = 'Lỗi internet, vui lòng kiểm tra kết nối';
  //       }
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       status = AxiosConfig.REQUEST_STATUS_CODE.CONFIG_ERROR;
  //       message = error.message;
  //     }
  //   }
  // } catch (e) {
  //   status = AxiosConfig.REQUEST_STATUS_CODE.HANDLE_ERROR;
  //   message = e.message;
  // }
};

axiosInstance.interceptors.request.use(async request => {
  logRequest(request);
  const token = store.getState().AuthReducer.accessToken;
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

export const handleAlertError = error => {
  refLoadingCpn?.dismiss();
  return Alert.alert(t('errorTitle'), error, [
    {
      text: 'Ok',
    },
  ]);
};

const listFullResponse = [
  apiPrefix.LOGIN,
  apiPrefix.SEND_REGISTER_REQUEST,
  apiPrefix.VERIFY_OTP,
  apiPrefix.CREATE_NEW_PASS,
  apiPrefix.ACITVE_APARTMENT,
  apiPrefix.SEND_OTP_FORGOT_PASS,
];

axiosInstance.interceptors.response.use(
  response => {
    // console.log('response', response);
    logResponse(response);
    if (
      response.data !== null &&
      response.data !== undefined &&
      response.status.toString().startsWith('2')
    ) {
      const dataResponse = response.data;
      if (
        listFullResponse.findIndex(ele =>
          response?.config?.url.includes(ele),
        ) !== -1
      ) {
        return dataResponse;
      }
      if (
        dataResponse.meta !== null &&
        dataResponse.meta !== null &&
        dataResponse.meta.error_code === 200
      ) {
        return dataResponse.data;
      } else {
        return handleAlertError(dataResponse.meta?.error_message);
      }
    } else if (response.status == '401') {
      showAlertCustomResponse({
        title: t('sessionExpired'),
        description: t('plsReLogin'),
        onConfirm: async () => {
          // const res = await deleteTokenFcm(deleteTokenSchema());
          store.dispatch(logoutAction());
        },
      });
    } else {
      return handleAlertError(response.statusText);
    }
  },
  error => {
    console.log('throw error here', error);
    if (error.response) {
      const apiName = error.config.url || 'UNKNOWN';
      logError(apiName, error.response);
    } else {
      console.log('API Error', error);
    }
    return handlingErrors(error);
  },
);

export default axiosInstance;

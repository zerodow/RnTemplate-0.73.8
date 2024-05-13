// import Config from 'react-native-config';
// export const {BASE_URL, ENV} = Config;

export const BASE_DOMAIN = 'https://i-apigw.cnttvietnam.com.vn';
export const BASE_URL = 'https://i-apigw.cnttvietnam.com.vn/api';
export const IMAGE_URL = 'https://i-apigw.cnttvietnam.com.vn/uploads/images';
export const DOWNLOAD_FILE_URL =
  'https://i-apigw.cnttvietnam.com.vn/uploads/files';
export const UPLOAD_URL =
  'https://i-apigw.cnttvietnam.com.vn/api/upload/uploadImage';
export const ENV = 'Development'; //"Production"
export const OTP_TIMEOUT = 180;

export const AxiosConfig = {
  API_TIMEOUT: 60000,
  BASE_URL,
};

export const RESPONSE_CODE = {
  RESPONSE_SUCCESS: 200,
  UNAUTHORIZED: 401,
};

export const PAGE_SIZE = 20;

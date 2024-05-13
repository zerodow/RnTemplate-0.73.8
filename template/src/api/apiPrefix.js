export default {
  LOGIN: 'app/user/login',
  //REGISTER
  SEND_REGISTER_REQUEST: 'app/user/register',
  SEND_OTP_REGISTER: 'app/user/sendRegisterCode',
  VERIFY_OTP: 'app/user/accsessRegisterCode',
  CREATE_NEW_PASS: 'app/user/NewPassword',
  ACITVE_APARTMENT: 'app/user/activeApartment',

  //FORGOT_PASS
  SEND_OTP_FORGOT_PASS: 'app/user/sendChangePassCode',
  CHANGE_PASSWORD: 'app/user/changePassword',

  //OTHER
  CHANGE_LANGUAGE: 'app/user/changeLanguage',
  GET_LIST_BANNER: 'app/category/banner',
  DETAIL_BANNER: 'app/category/GetDetailBanner',
  GET_LIST_NEWS: 'app/category/GetListNewsNormal',
  GET_LIST_NEWS_LETTER: 'app/category/GetListNews',
  GET_DETAIL_NEWS_LETTER: 'app/Category/GetDetailNews',
  GET_HAND_LIST: 'app/category/GetListNotebook',
  GET_HAND_LIST_CATEGORY: 'app/category/GetListCategory',
  UPDATE_USER_INFO: 'app/user/changeInfo',
  UPDATE_AVATAR: 'upload/uploadImage',
  HOTLINE: 'app/category/hotline',
  QUESTION: 'app/category/GetListFaq',
  GET_LIST_APART: 'app/apartmentMap/GetByPageApartment',
  GET_DETAIL_APART: 'app/apartmentMap/GetByPageMemberApartment',
  DELETE_ACCOUNT: 'app/user/removeAccount',

  //NOTI
  GET_LIST_NOTI: 'v1/Notification/getByPageAndUserId',
  PUSH_TOKEN: 'v1/TokenFcm',

  //CONFIG:
  VERSION_CONFIG: 'app/config/getConfig/1',
  APPVIEW_CONFIG: 'app/config/getViewApp',
  LANG_CONFIG: 'app/config/getLanguageValue',
};

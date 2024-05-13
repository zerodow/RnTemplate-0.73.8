const DATE_FORMAT = 'DD/MM/YYYY';
const TIME_FORMAT = 'hh:mm a';

const NAME_REDUCER = {
  APP: 'app',
  AUTH: 'auth',
};

const APP_THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

const APP_LANGUAGE = {
  EN: 'en',
  VI: 'vi',
};

const LANG_ID = {
  VI: 1,
  EN: 2,
};

const FORMAT_TIME_NEWS = 'DD/MM/YYYY hh:mm';

const FORMAT_TIME_NEWS_LETTER = 'hh:mm  DD/MM/YYYY';

const GENDER_ARR = [
  {
    code: 1,
    description: 'male',
  },
  {
    code: 2,
    description: 'female',
  },
];

const GENDER_MALE = 1;
const GENDER_FEMALE = 2;

const PHOTO_PERMISSION_TYPE = {
  CAMERA: 'CAMERA',
  LIBRARY: 'LIBRARY',
};

const EMPTY_HEIGHT = 80;

const DEVICE_TYPE = {
  IOS: 'IOS',
  ANDROID: 'ANDROID',
};

const READ_STATUS = {
  READ: 1,
  UNREAD: 2,
  ALL: null,
};

const VIEW_BLOCK = {
  BLOCK_UTILLITIES: 'listUtilities',
  BLOCK_TOWER: 'listTowerMaps',
  BLOCK_SERVICES: 'listServices',
  BLOCK_FUNCTION: 'listFunctions',
  BLOCK_BLOCKS: 'listBlocks',
};

const BLOCK_CODE = {
  CN: 'CN',
  BT: 'BT',
  TI: 'TI',
  DV: 'DV',
  TT: 'TT',
  QC: 'QC',
  PA: 'PA',
  HD: 'HD',
  DKVC: 'DKVC',
};

export {
  DATE_FORMAT,
  TIME_FORMAT,
  APP_THEME,
  NAME_REDUCER,
  APP_LANGUAGE,
  LANG_ID,
  FORMAT_TIME_NEWS,
  FORMAT_TIME_NEWS_LETTER,
  GENDER_ARR,
  GENDER_FEMALE,
  GENDER_MALE,
  PHOTO_PERMISSION_TYPE,
  EMPTY_HEIGHT,
  DEVICE_TYPE,
  READ_STATUS,
  VIEW_BLOCK,
  BLOCK_CODE,
};

import IconSVG from 'src/assets/icons/IconSVG';
import RouteName from 'src/routes/RouteName';

const FEATURE_CONST = {
  APART_MANAGER: 'apartManager',
  HAND_LIST: 'handList',
  INFO_BUILDING: 'infoBuilding',
  QUESTION: 'question',
  CHANGE_LANG: 'changeLang',
  CHANGE_PASS: 'changePass',
  LOGOUT: 'logout',
  DELETE_ACC: 'deleteAcc',
};

const listFeature = [
  {
    title: FEATURE_CONST.APART_MANAGER,
    icon: IconSVG.home2,
    destination: RouteName.MANAGER_APART,
  },
  {
    title: FEATURE_CONST.HAND_LIST,
    icon: IconSVG.contact,
    destination: RouteName.HAND_LIST,
  },
  {
    title: FEATURE_CONST.QUESTION,
    icon: IconSVG.question,
    destination: RouteName.QUESTION_LIST,
  },
  {
    title: FEATURE_CONST.CHANGE_LANG,
    icon: IconSVG.worldwide,
    destination: RouteName.CHANGE_LANG,
  },
  {
    title: FEATURE_CONST.CHANGE_PASS,
    icon: IconSVG.lock,
    destination: RouteName.CHANGE_PASS,
  },
  {
    title: FEATURE_CONST.LOGOUT,
    icon: IconSVG.logout,
  },
  {
    title: FEATURE_CONST.DELETE_ACC,
    icon: IconSVG.banned,
  },
];

export {listFeature, FEATURE_CONST};

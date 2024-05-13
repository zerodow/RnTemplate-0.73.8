import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import RouteName from './RouteName';
import IconSVG from '../assets/icons/IconSVG';
import TabAccount from '../screens/TabAccount';
import TabHome from '../screens/TabHome';
import TabNewsLetter from '../screens/TabNewsLetter';
import TabNoti from '../screens/TabNoti';
import TabReport from '../screens/TabReport';
import TabContainer from './TabContainer';
import Welcome from 'src/screens/Welcome';
import RegisterScreen from 'src/screens/RegisterScreen';
import QRScan from 'src/screens/QRScan';
import DetailNoti from 'src/screens/TabNoti/DetailNoti';
import ManagerApart from 'src/screens/ManagerApart';
import ChangeLanguage from 'src/screens/ChangeLanguage';
import ChangePass from 'src/screens/ChangePass';
import HandList from 'src/screens/HandList';
import QuestionList from 'src/screens/QuestionList';
import QuestionDetail from 'src/screens/QuestionList/QuestionDetail';
import NewsLetterDetail from 'src/screens/NewsLetterList/NewsLetterDetail';
import NewsLetterList from 'src/screens/NewsLetterList';
import NewsList from 'src/screens/NewsList';
import NewsDetail from 'src/screens/NewsList/NewsDetail';
import DetailApart from 'src/screens/ManagerApart/DetailApart';
import UpdateInfo from 'src/screens/UpdateInfo';
import DetailHandList from 'src/screens/HandList/DetailHandList';
import DetailBanner from 'src/screens/DetailBanner';

const AuthConfigScreen = [
  {
    name: RouteName.SPLASH,
    component: SplashScreen,
  },
  {
    name: RouteName.WELCOME,
    component: Welcome,
  },
  {
    name: RouteName.LOGIN,
    component: LoginScreen,
  },
  {
    name: RouteName.REGISTER,
    component: RegisterScreen,
  },
  {
    name: RouteName.QR_SCAN,
    component: QRScan,
  },
];

const TabConfig = [
  {
    name: RouteName.TAB_REPORT,
    component: TabReport,
    icon: IconSVG.report,
  },
  {
    name: RouteName.TAB_NEWS_LETTER,
    component: TabNewsLetter,
    icon: IconSVG.news,
  },
  {
    name: RouteName.TAB_HOME,
    component: TabHome,
    icon: IconSVG.home,
  },
  {
    name: RouteName.TAB_NOTI,
    component: TabNoti,
    icon: IconSVG.noti,
  },
  {
    name: RouteName.TAB_ACCOUNT,
    component: TabAccount,
    icon: IconSVG.account,
  },
];

const AppConfigScreen = [
  {
    name: RouteName.MAIN,
    component: TabContainer,
  },
  {
    name: RouteName.QR_SCAN,
    component: QRScan,
  },
  {
    name: RouteName.DETAIL_NOTI,
    component: DetailNoti,
  },
  {
    name: RouteName.MANAGER_APART,
    component: ManagerApart,
  },
  {
    name: RouteName.APART_DETAIL,
    component: DetailApart,
  },
  {
    name: RouteName.CHANGE_LANG,
    component: ChangeLanguage,
  },
  {
    name: RouteName.CHANGE_PASS,
    component: ChangePass,
  },
  {
    name: RouteName.HAND_LIST,
    component: HandList,
  },
  {
    name: RouteName.HAND_LIST_DETAIL,
    component: DetailHandList,
  },
  {
    name: RouteName.QUESTION_LIST,
    component: QuestionList,
  },
  {
    name: RouteName.QUESTION_DETAIL,
    component: QuestionDetail,
  },
  {
    name: RouteName.NEWS_LETTER_LIST,
    component: NewsLetterList,
  },
  {
    name: RouteName.NEWS_LETTER_DETAIL,
    component: NewsLetterDetail,
  },
  {
    name: RouteName.NEWS_LIST,
    component: NewsList,
  },
  {
    name: RouteName.NEWS_DETAIL,
    component: NewsDetail,
  },
  {
    name: RouteName.UPDATE_INFO,
    component: UpdateInfo,
  },
  {
    name: RouteName.DETAIL_BANNER,
    component: DetailBanner,
  },
];

export {AuthConfigScreen, TabConfig, AppConfigScreen};

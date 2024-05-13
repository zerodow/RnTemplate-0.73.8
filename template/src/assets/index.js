import {Platform} from 'react-native';

const fonts = Platform.select({
  ios: {
    regular: 'Arial',
    semiBold: 'Arial',
  },
  android: {
    regular: 'Arial',
    semiBold: 'Arial',
  },
});

const img = {
  icon_thumb: require('./images/icon_thumb.png'),
  bg_thumb: require('./images/bg_thumb.jpg'),
  user_thumb: require('./images/user_thumb.png'),
  wallPaper: require('./images/wallpaper.png'),
  wall1: require('./images/wall1.png'),
  tabBg: require('./images/tab.png'),
  drop: require('./images/drop.png'),
  logo: require('./images/logo.png'),
  backdrop: require('./images/backdrop.png'),
  register: require('./images/register.png'),
  bg2: require('./images/bg2.png'),
  bgSub: require('./images/bgSub.png'),
  bgDigi: require('./images/bg_digi.jpg'),
  circleLogo: require('./images/circleLogo.png'),
  qrConner: require('./images/qrconner.png'),
  flash: require('./images/flash.png'),
  backdrop2: require('./images/backdrop2.png'),
  bill: require('./images/bill.png'),
  report: require('./images/report.png'),
  header: require('./images/header.png'),
  demo: require('./images/demo.png'),
  demo2: require('./images/demo2.png'),
  demo3: require('./images/demo3.png'),
  demo4: require('./images/demo4.png'),
  demo5: require('./images/demo5.png'),
  vi: require('./images/vi.png'),
  en: require('./images/en.png'),
  qr: require('./images/qr.png'),
  reload: require('./images/reload.png'),
};

export {fonts, img};

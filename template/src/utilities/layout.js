import {Dimensions, Platform, StatusBar} from 'react-native';
// import {getStatusBarHeight} from 'react-native-iphone-x-helper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

let inputHeight = 40;

let statusBarPadding = 0;
let isOldDevice = false;
let statusBarHeight = isIOS ? 0 : StatusBar.currentHeight;

const majorVersionOS = parseInt(Platform.Version, 10);

if (Platform.OS === 'ios') {
  // console.log('ios version is:', majorVersionOS);

  //   statusBarHeight = getStatusBarHeight();

  if (majorVersionOS < 11) {
    //old iOS device
    statusBarPadding = 20; //safe area doesn't work in old iOS devices
    isOldDevice = true;
  }
} else {
  // console.log('android version is:', majorVersionOS);

  if (majorVersionOS < 23) {
    //old android device
    isOldDevice = true;
  } else {
    statusBarPadding = StatusBar.currentHeight; //to add statusbar height at top of the container in new devices
  }
}

const isIOS = Platform.OS === 'ios';
const isSmallDevice = deviceHeight < 700;

const bgHeaderFullHeightForSmallTop = deviceWidth / 3;

const bgHeaderSmallHeightForSmallTop = deviceWidth / 4.5;

const bgHeaderFullHeight = deviceWidth / 2.5;

const bgHeaderSmallHeight = deviceWidth / 3.75;

export {
  deviceWidth,
  deviceHeight,
  statusBarPadding,
  statusBarHeight,
  isIOS,
  isOldDevice,
  inputHeight,
  isSmallDevice,
  bgHeaderFullHeight,
  bgHeaderSmallHeight,
  bgHeaderFullHeightForSmallTop,
  bgHeaderSmallHeightForSmallTop,
};

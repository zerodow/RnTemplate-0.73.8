import {StatusBar} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {APP_THEME} from '../utilities/constants';
import {isIOS} from '../utilities/layout';
import {NavigationContainer} from '@react-navigation/native';
import DarkTheme from '../assets/themes/DarkTheme';
import LightTheme from '../assets/themes/LightTheme';
import UpdateLoading from '../components/UpdateLoading';
import {navigationRef} from '../utilities/helper/navigationHelper';
import LoadingContainer from '../components/LoadingContainer';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import AbsoluteMenu from 'src/screens/TabHome/components/AbsoluteMenu';
import {
  CodePushSyncStatus,
  codePushAllowRestart,
  codePushCheckUpdate,
} from 'src/utilities/helper/updateHelper';
import DeviceInfo from 'react-native-device-info';
import {setAndroidApiLevelAction, setDeviceIdAction} from 'src/store/app';

let refUpdateCpn;

let refLoadingCpn;

let refAbsoluteMenu;

const AppConfigScreen = () => {
  const appTheme = useSelector(state => state.AppReducer.appTheme);
  const accessToken = useSelector(state => state.AuthReducer.accessToken);

  const statusBarStyle = useMemo(() => {
    switch (appTheme) {
      case APP_THEME.DARK:
        if (isIOS) {
          return 'light-content';
        }
        return 'dark-content';
      default:
        if (isIOS) {
          return 'dark-content';
        }
        return 'light-content';
    }
  }, [appTheme]);

  const myTheme = useMemo(() => {
    switch (appTheme) {
      case APP_THEME.DARK:
        return DarkTheme;
      default:
        return LightTheme;
    }
  }, [appTheme]);

  const dispatch = useDispatch();
  React.useEffect(() => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      dispatch(
        setDeviceIdAction({
          deviceId: uniqueId,
        }),
      );
    });
    if (!isIOS) {
      DeviceInfo.getApiLevel().then(apiLevel => {
        if (apiLevel) {
          dispatch(
            setAndroidApiLevelAction({
              androidApiLevel: apiLevel,
            }),
          );
        }
      });
    }
  }, []);

  React.useLayoutEffect(() => {
    // refUpdateCpn?.show();
    setTimeout(() => {
      checkForUpdate();
    }, 3000);
  }, []);

  const checkForUpdate = async () => {
    codePushCheckUpdate({
      codePushStatusDidChange: codePushStatusChange,
      downloadProgressCallback: downloadProgressCallback,
    });
  };

  const codePushStatusChange = syncStatus => {
    switch (syncStatus) {
      case CodePushSyncStatus.CHECKING_FOR_UPDATE: {
        console.log('Checking for update');
        break;
      }
      case CodePushSyncStatus.DOWNLOADING_PACKAGE:
        refUpdateCpn?.show();
        console.log('Downloading package');
        break;
      case CodePushSyncStatus.AWAITING_USER_ACTION:
        console.log('Awaiting user action');
        break;
      case CodePushSyncStatus.INSTALLING_UPDATE:
        console.log('Installing update');
        break;
      case CodePushSyncStatus.UP_TO_DATE:
        console.log('App up to date.');
        onLoadConfigData();
        break;
      case CodePushSyncStatus.UPDATE_IGNORED:
        console.log('Update cancelled by user.');
        //   onLoadConfigData();
        break;
      case CodePushSyncStatus.UNKNOWN_ERROR:
        console.log('An unknown error occurred.');
        //   onLoadConfigData();
        break;
      case CodePushSyncStatus.UPDATE_INSTALLED:
        refUpdateCpn?.dismiss();
        console.log('Update installed and will be applied on restart.');
        codePushAllowRestart();
        break;
      default:
        onLoadConfigData();
        break;
    }
  };

  const downloadProgressCallback = () => {};

  const onLoadConfigData = () => {
    //load config
  };

  const renderNavigator = useCallback(() => {
    if (true) {
      return <AppNavigator />;
    }
    return <AuthNavigator />;
  }, [accessToken]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={statusBarStyle} />
      <NavigationContainer theme={myTheme} ref={navigationRef}>
        {renderNavigator()}
        <UpdateLoading
          ref={r => {
            refUpdateCpn = r;
          }}
        />
        <LoadingContainer
          ref={r => {
            refLoadingCpn = r;
          }}
        />
        <AbsoluteMenu
          ref={r => {
            refAbsoluteMenu = r;
          }}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export {refUpdateCpn, refLoadingCpn, refAbsoluteMenu};

export default AppConfigScreen;

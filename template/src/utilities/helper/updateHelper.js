import {Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {ENV} from '../constants/systemConfig';
import codePush from 'react-native-code-push';

export const CodePushSyncStatus = {
  CHECKING_FOR_UPDATE: codePush.SyncStatus.CHECKING_FOR_UPDATE,
  DOWNLOADING_PACKAGE: codePush.SyncStatus.DOWNLOADING_PACKAGE,
  AWAITING_USER_ACTION: codePush.SyncStatus.AWAITING_USER_ACTION,
  INSTALLING_UPDATE: codePush.SyncStatus.INSTALLING_UPDATE,
  UP_TO_DATE: codePush.SyncStatus.UP_TO_DATE,
  UPDATE_IGNORED: codePush.SyncStatus.UPDATE_IGNORED,
  UNKNOWN_ERROR: codePush.SyncStatus.UNKNOWN_ERROR,
  UPDATE_INSTALLED: codePush.SyncStatus.UPDATE_INSTALLED,
};

export const updateNative = async () => {
  if (ENV === 'Development') {
    return;
  }
  try {
    const updateData = await VersionCheck.needUpdate();
    // console.log('updateData', updateData);
    if (updateData?.isNeeded) {
      Linking.openURL(updateData.storeUrl); // open store if update is needed.
      return;
    }
  } catch (error) {}
};

export const codePushAllowRestart = codePush.allowRestart();

export const codePushCheckUpdate = ({
  codePushStatusDidChange,
  downloadProgressCallback,
}) => {
  codePush.notifyAppReady();
  codePush.sync(
    {
      updateDialog: null,
      installMode: codePush.InstallMode.IMMEDIATE,
      rollbackRetryOptions: {
        delayInHours: 0.1,
        maxRetryAttempts: 1,
      },
    },
    codePushStatusDidChange,
    downloadProgressCallback,
  );
};

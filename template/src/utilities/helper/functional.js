import {t} from 'i18next';
import {Alert, Linking, Platform} from 'react-native';
import {img} from 'src/assets';
import {
  bgHeaderFullHeight,
  bgHeaderFullHeightForSmallTop,
  bgHeaderSmallHeight,
  bgHeaderSmallHeightForSmallTop,
} from '../layout';
import {PHOTO_PERMISSION_TYPE, UPLOAD_URL, VIEW_BLOCK} from '../constants';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {store} from 'src/store';
import RNFetchBlob from 'rn-fetch-blob';

const delay = value => {
  return new Promise(resolve => {
    const t = setTimeout(() => {
      clearTimeout(t);
      resolve();
    }, value);
  });
};

const hitSlop = val => ({
  top: val,
  bottom: val,
  left: val,
  right: val,
});

const showAlertConfirm = ({title, description, confirmTitle, cancelTitle}) => {
  return new Promise((resolve, reject) => {
    Alert.alert(title || t('errorTitle'), description, [
      {
        text: cancelTitle || t('cancel'),
        onPress: () => reject(false),
      },
      {
        text: confirmTitle || t('ok'),
        onPress: () => resolve(true),
      },
    ]);
  });
};

const showAlertCustomResponse = ({
  title,
  description,
  confirmTitle,
  onConfirm,
}) => {
  return Alert.alert(title || t('errorTitle'), description, [
    {
      text: confirmTitle || t('ok'),
      onPress: () => onConfirm && onConfirm(),
    },
  ]);
};

const showInfoAlert = ({title, description = '', confirmTitle = ''}) => {
  return Alert.alert(title || t('errorTitle'), description, [
    {
      text: confirmTitle || t('ok'),
    },
  ]);
};

const calHeaderHeight = (top, isLargeBg) => {
  let height;
  if (top <= 25) {
    height = isLargeBg
      ? bgHeaderFullHeightForSmallTop
      : bgHeaderSmallHeightForSmallTop;
  } else {
    height = isLargeBg ? bgHeaderFullHeight : bgHeaderSmallHeight;
  }
  return {
    source: isLargeBg ? img.wall1 : img.header,
    height: height,
  };
};

const photoRequestPermission = (permissionType, fallback) => {
  const apiLevel = store.getState().AppReducer.androidApiLevel;
  return new Promise(async resolve => {
    let status = false;
    try {
      let permission;
      if (permissionType === PHOTO_PERMISSION_TYPE.CAMERA) {
        permission = Platform.select({
          android: PERMISSIONS.ANDROID.CAMERA,
          ios: PERMISSIONS.IOS.CAMERA,
        });
      } else {
        permission = Platform.select({
          android:
            apiLevel >= 33
              ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        });
      }
      const statusCheck = await check(permission);
      if (statusCheck === RESULTS.BLOCKED) {
        if (fallback) fallback();
      } else {
        const result = await request(permission);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            {
              alert(
                permissionType === PHOTO_PERMISSION_TYPE.CAMERA
                  ? 'camInvalid'
                  : 'photoInvalid',
              );
              if (fallback) fallback();
            }
            break;
          case RESULTS.DENIED:
            if (fallback) fallback();
            // denied
            break;
          case RESULTS.GRANTED:
            status = true;
            break;
          case RESULTS.BLOCKED:
            // blocked
            if (fallback) fallback();
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
    resolve(status);
  });
};

function JSONParseSafe(text, reviver) {
  try {
    return JSON.parse(text, reviver);
  } catch (ex) {
    return {
      error: ex,
    };
  }
}

const uploadFile = listFiles => {
  const token = store.getState().AuthReducer.accessToken;
  console.log('=========> ', listFiles);
  // console.log('url', `${constant.API_URL}Upload/uploadImage`);
  return new Promise((resolve, reject) => {
    RNFetchBlob.fetch(
      'POST',
      UPLOAD_URL,
      {
        'Content-Type': 'multipart/form-data',
        Authorization: `bearer ${token}`,
      },
      listFiles,
    )
      .then(res => {
        const obj = JSONParseSafe(res.data);
        resolve(obj);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const callFunc = phone => {
  Linking.canOpenURL(`tel:${phone}`)
    .then(supported => {
      console.log('supported', supported);
      if (!supported) {
        console.log("Can't handle url: ");
      } else {
        return Linking.openURL(`tel:${phone}`);
      }
    })
    .catch(err => console.log('An error occurred', err));
};

const mailFunc = mail => {
  Linking.canOpenURL(`mailto:${mail}`)
    .then(supported => {
      if (!supported) {
        console.log("Can't handle url: ");
      } else {
        return Linking.openURL(`mailto:${mail}`);
      }
    })
    .catch(err => console.log('An error occurred', err));
};

export {
  delay,
  hitSlop,
  showAlertConfirm,
  showAlertCustomResponse,
  showInfoAlert,
  calHeaderHeight,
  photoRequestPermission,
  uploadFile,
  callFunc,
  mailFunc,
};

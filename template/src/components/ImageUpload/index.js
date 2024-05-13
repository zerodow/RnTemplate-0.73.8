import {Alert} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import ModalOption from '../ModalOption';
import {t} from 'i18next';
import {openSettings} from 'react-native-permissions';
import {photoRequestPermission} from 'src/utilities/helper/functional';
import {PHOTO_PERMISSION_TYPE} from 'src/utilities/constants';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ImageUpload = ({handleImage = () => {}}, _ref) => {
  useImperativeHandle(_ref, () => ({start}));

  const ref = useRef({
    refModal: null,
    options: {
      title: '',
      takePhotoButtonTitle: t('takePhoto'),
      chooseFromLibraryButtonTitle: t('chooseFromLibrary'),
      cancelButtonTitle: t('cancel'),
      quality: 0.5,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      noData: false,
    },
  }).current;

  const start = () => {
    ref.refModal?.show();
  };

  const onRequireCameraPermission = () => {
    Alert.alert(t('cameraPer'), t('cameraPerDes'), [
      {
        style: 'cancel',
        text: t('cancel'),
      },
      {
        onPress: () =>
          openSettings().catch(() => console.log('cannot open settings')),
        style: 'default',
        text: t('giant'),
      },
    ]);
  };

  const onRequirePhotoPermission = () => {
    Alert.alert(t('photoPer'), t('photoPerDes'), [
      {
        style: 'cancel',
        text: t('cancel'),
      },
      {
        onPress: () =>
          openSettings().catch(() => console.log('cannot open settings')),
        style: 'default',
        text: t('giant'),
      },
    ]);
  };

  const _onChooseImage = async () => {
    const status = await photoRequestPermission(
      PHOTO_PERMISSION_TYPE.LIBRARY,
      onRequirePhotoPermission,
    );

    if (!status) return;

    launchImageLibrary(ref.options, res => {
      // console.log('res', res);
      if (res?.assets) {
        let data = res?.assets[0];
        handleImage(data);
      }
    });
  };

  const _onTakePicture = async () => {
    const status = await photoRequestPermission(
      PHOTO_PERMISSION_TYPE.CAMERA,
      onRequireCameraPermission,
    );

    if (!status) return;

    launchCamera(ref.options, res => {
      //   console.log('res', res);
      if (res?.assets) {
        let data = res?.assets[0];
        handleImage(data);
      }
    });
  };

  return (
    <>
      <ModalOption
        ref={r => (ref.refModal = r)}
        onChooseImage={_onChooseImage}
        onTakePicture={_onTakePicture}
      />
    </>
  );
};

export default forwardRef(ImageUpload);

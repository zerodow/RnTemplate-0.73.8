import {View, StyleSheet} from 'react-native';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTheme} from '@react-navigation/native';
import {AppColors, AppFont} from '../../utilities/constants';
import Modal from 'react-native-modal';
import TouchableDebounce from '../TouchableDebounce';
import TextView from '../TextView';
import {delay} from 'src/utilities/helper/functional';

const ModalOption = (
  {onTakePicture = () => {}, onChooseImage = () => {}},
  _ref,
) => {
  useImperativeHandle(_ref, () => ({show, dismiss}));

  const ref = useRef({
    resolve: null,
  }).current;

  const [visible, setVisible] = useState(false);

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const show = () => {
    return new Promise(resv => {
      ref.resolve = resv;
      setVisible(true);
    });
  };

  const dismiss = () => {
    return new Promise(resv => {
      setVisible(false);
      ref.resolve = resv;
    });
  };

  const _onShow = () => {
    if (ref.resolve !== null) {
      ref.resolve();
      ref.resolve = null;
    }
  };

  const _onDismiss = () => {
    if (ref.resolve !== null) {
      ref.resolve();
      ref.resolve = null;
    }
  };

  const takePicture = async () => {
    dismiss();
    await delay(300);
    onTakePicture();
  };

  const chooseImage = async () => {
    dismiss();
    await delay(200);
    onChooseImage();
  };

  if (!visible) {
    return <></>;
  }

  return (
    <Modal
      onModalHide={_onDismiss}
      onModalShow={_onShow}
      isVisible={visible}
      onBackdropPress={() => dismiss()}
      backdropOpacity={0.4}
      useNativeDriver
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      useNativeDriverForBackdrop
      style={styles.container}
      statusBarTranslucent>
      <View style={styles.wrapContainer}>
        <TouchableDebounce style={styles.v1} onPress={takePicture}>
          <TextView style={styles.option} keyLang="takePic" />
        </TouchableDebounce>
        <TouchableDebounce
          style={[styles.v1, {borderTopWidth: 0.5}]}
          onPress={chooseImage}>
          <TextView style={styles.option} keyLang="chooseLib" />
        </TouchableDebounce>
      </View>
    </Modal>
  );
};

export default memo(forwardRef(ModalOption));

const makeStyles = colors => {
  return StyleSheet.create({
    container: {justifyContent: 'flex-end', margin: 0},
    wrapContainer: {
      backgroundColor: AppColors.white,
      paddingBottom: 20,
      paddingVertical: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    titleView: {padding: 15, alignSelf: 'center'},
    titleStyle: {
      fontSize: AppFont.fontSize.s18,
      fontWeight: AppFont.fontWeight.bold,
    },
    v1: {
      borderColor: colors.border,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    option: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.regular,
      color: colors.neutral1,
    },
  });
};

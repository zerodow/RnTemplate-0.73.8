import {useTheme} from '@react-navigation/native';
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  memo,
} from 'react';
import {View, Keyboard, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import TextView from '../TextView';
import {AppFont} from 'src/utilities/constants';
import Button from '../Button';
import {t} from 'i18next';
import {deviceWidth} from 'src/utilities/layout';
import {delay} from 'src/utilities/helper/functional';

const AlertCustom = (
  {
    onConfirm = () => {},
    onCancel = () => {},
    confirmTitle,
    cancelTitle,
    title,
    description,
  },
  _ref,
) => {
  useImperativeHandle(_ref, () => ({show, dismiss}));

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const ref = useRef({
    resolve: null,
    LoadingIndicator: null,
    cancel: () => {},
  }).current;

  const [visible, setVisible] = useState(false);

  const show = async () => {
    Keyboard?.dismiss();
    return new Promise(resv => {
      ref.resolve = resv;
      setVisible(true);
    });
  };

  const dismiss = () => {
    ref.cancel();
    return new Promise(resv => {
      ref.resolve = resv;
      setVisible(false);
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

  const onConfirmPress = async () => {
    await dismiss();
    await delay(300);
    onConfirm();
  };

  const onCancelPress = async () => {
    await dismiss();
    await delay(300);
    onCancel();
  };

  return (
    <Modal
      isVisible={visible}
      onModalHide={_onDismiss}
      onModalShow={_onShow}
      backdropOpacity={0.4}
      useNativeDriver
      //   onBackdropPress={dismiss}
      style={styles.container}
      hideModalContentWhileAnimating
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      useNativeDriverForBackdrop
      statusBarTranslucent>
      <View style={styles.wrapper}>
        <TextView style={styles.titleStyle}>{title}</TextView>
        <TextView style={styles.desStyle}>{description}</TextView>
        <Button
          text={t(confirmTitle)}
          containerStyle={styles.btnContainer}
          textStyle={styles.v1}
          onPress={onConfirmPress}
        />
        <Button
          text={t(cancelTitle)}
          containerStyle={[
            styles.btnContainer,
            {backgroundColor: colors.btnSecondBg},
          ]}
          textStyle={styles.v2}
          onPress={onCancelPress}
        />
      </View>
    </Modal>
  );
};

export default memo(forwardRef(AlertCustom));

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      margin: 0,
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 15,
    },
    wrapper: {
      backgroundColor: 'white',
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s18,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary1,
      textAlign: 'center',
      marginTop: 10,
    },
    desStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
      color: colors.neutral4,
      textAlign: 'center',
      marginVertical: 10,
    },
    btnContainer: {
      width: deviceWidth / 2.2,
      alignSelf: 'center',
      marginTop: 10,
      height: 35,
    },
    v1: {
      fontWeight: AppFont.fontWeight.bold,
    },
    v2: {
      color: colors.neutral3,
      fontWeight: AppFont.fontWeight.bold,
    },
  });

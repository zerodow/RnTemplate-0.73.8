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
import {AppFont} from 'src/utilities/constants';
import {t} from 'i18next';
import {deviceWidth} from 'src/utilities/layout';
import {delay, hitSlop} from 'src/utilities/helper/functional';
import TextView from 'src/components/TextView';
import Button from 'src/components/Button';
import IconSVG from 'src/assets/icons/IconSVG';
import Icon from 'src/components/Icons';
import QRCode from 'react-native-qrcode-svg';
import TouchableDebounce from 'src/components/TouchableDebounce';

const ModalQR = ({apartName, qrCode}, _ref) => {
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

  return (
    <Modal
      isVisible={visible}
      onModalHide={_onDismiss}
      onModalShow={_onShow}
      backdropOpacity={0.4}
      useNativeDriver
      onBackdropPress={dismiss}
      style={styles.container}
      hideModalContentWhileAnimating
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      useNativeDriverForBackdrop
      statusBarTranslucent>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TextView keyLang="apartCode" style={styles.titleStyle} />
          <TouchableDebounce hitSlop={hitSlop(15)} onPress={() => dismiss()}>
            <Icon source={IconSVG.close} size={15} color="#999" />
          </TouchableDebounce>
        </View>
        <TextView keyLang="apart" style={styles.apartNameStyle} />
        <QRCode value={qrCode} size={deviceWidth / 2} />
        <TextView style={styles.value}>{qrCode}</TextView>
        {/* <Button
        text={'ok'}
        containerStyle={styles.btnContainer}
        textStyle={styles.v1}
        onPress={() => dismiss()}
    /> */}
      </View>
    </Modal>
  );
};

export default memo(forwardRef(ModalQR));

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
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.neutral3,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s18,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary1,
      textAlign: 'left',
      //   marginTop: 10,
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
    apartNameStyle: {
      fontSize: AppFont.fontSize.s16,
      color: colors.neutral3,
      fontWeight: AppFont.fontWeight.bold,
      marginBottom: 20,
      marginTop: 10,
    },
    value: {
      fontSize: AppFont.fontSize.s14,
      color: colors.neutral3,
      fontWeight: AppFont.fontWeight.regular,
      marginVertical: 10,
    },
  });

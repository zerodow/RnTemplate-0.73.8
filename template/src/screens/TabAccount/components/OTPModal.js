import {useTheme} from '@react-navigation/native';
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  memo,
  useEffect,
} from 'react';
import {View, Keyboard, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {AppFont, OTP_TIMEOUT, RESPONSE_CODE} from 'src/utilities/constants';
import {delay, showAlertCustomResponse} from 'src/utilities/helper/functional';
import TextView from 'src/components/TextView';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import TouchableDebounce from 'src/components/TouchableDebounce';
import CircleProgress from 'src/components/CircleProgress';
import {sendChangePassCode, verifyOTP} from 'src/api/auth';
import {refLoadingCpn} from 'src/routes';
import {useSelector} from 'react-redux';

const OTPModal = ({onContinue = () => {}}, _ref) => {
  useImperativeHandle(_ref, () => ({show, dismiss}));

  const phoneNumber = useSelector(state => state.AuthReducer.phoneNumber);
  const userId = useSelector(state => state.AuthReducer.userId);

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const ref = useRef({
    resolve: null,
    LoadingIndicator: null,
    cancel: () => {},
    otpRef: null,
  }).current;

  const [visible, setVisible] = useState(false);

  const [code, setCode] = useState();
  const [isActive, setActive] = useState(false);

  const restartCount = async () => {
    Keyboard.dismiss();
    const res = await sendChangePassCode(phoneNumber);
    console.log('ressssss', res);

    if (res) {
      if (res.meta.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
        //sang màn nhập otp
        await delay(1000);

        setCode();

        ref.process?.start();
        setActive(false);
      } else {
        showAlertCustomResponse({
          description: res.meta.error_message,
          onConfirm: () => dismiss(),
        });
      }
    }
  };

  useEffect(() => {
    if (code && code?.length === 6) {
      verityOTP(code);
    }
  }, [code]);

  const verityOTP = async newCode => {
    Keyboard.dismiss();
    const res = await verifyOTP({
      id: userId,
      code: newCode,
    });
    console.log('resssss verifyOTP', res);
    await delay(1000);

    if (res.meta.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
      onSuccess();
    } else {
      //bất kì error là gì thì cũng back lại
      showAlertCustomResponse({
        description: res.meta.error_message,
        onConfirm: () => dismiss(),
      });
    }
  };

  const onSuccess = async () => {
    await dismiss();
    await delay(300);
    onContinue();
  };

  const show = async () => {
    return new Promise(resv => {
      ref.resolve = resv;
      setVisible(true);
      restartCount();
      setTimeout(() => {
        ref.otpRef?.focusField(0);
      }, 300);
    });
  };

  const dismiss = () => {
    Keyboard.dismiss();
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
        <TextView keyLang="inputOTP" style={styles.title} />
        <TextView
          keyLang="inputSendTo"
          suffix={phoneNumber}
          style={styles.des}
        />
        <View style={styles.flex1Center}>
          <OTPInputView
            ref={r => (ref.otpRef = r)}
            autofillFromClipboard={false}
            style={styles.inputStyle}
            pinCount={6}
            code={code}
            onCodeChanged={newCode => setCode(newCode)}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
          />
          <View style={styles.time}>
            <TouchableDebounce disabled={!isActive} onPress={restartCount}>
              <TextView
                keyLang="resendOTP"
                style={[
                  styles.resendText,
                  {
                    color: isActive ? colors.primary05 : colors.neutral4,
                  },
                ]}
              />
            </TouchableDebounce>
            <CircleProgress
              initialValue={OTP_TIMEOUT}
              ref={r => (ref.process = r)}
              onDone={() => setActive(true)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(forwardRef(OTPModal));

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
      height: 300,
    },
    flex1Center: {
      flex: 1,
      justifyContent: 'center',
    },
    inputStyle: {height: 100},
    title: {
      fontSize: AppFont.fontSize.s20,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.homeIcon,
      alignSelf: 'center',
    },
    des: {
      fontSize: AppFont.fontSize.s16,
      alignSelf: 'center',
      marginTop: 15,
      textAlign: 'center',
    },
    underlineStyleBase: {
      width: 40,
      height: 40,
      fontSize: AppFont.fontSize.s16,
      color: colors.black,
    },
    underlineStyleHighLighted: {
      borderColor: colors.homeIcon,
    },
    time: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      height: 50,
    },
    resendText: {
      fontSize: AppFont.fontSize.s16,
    },
  });

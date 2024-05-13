import {View, StyleSheet, Keyboard} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import TextView from 'src/components/TextView';
import {AppFont, OTP_TIMEOUT, RESPONSE_CODE} from 'src/utilities/constants';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TouchableDebounce from 'src/components/TouchableDebounce';
import CircleProgress from 'src/components/CircleProgress';
import {resendRegisterCode, verifyOTP} from 'src/api/auth';
import {refLoadingCpn} from 'src/routes';
import {delay, showAlertCustomResponse} from 'src/utilities/helper/functional';
import {FORM} from 'src/utilities/constants/authConstant';
import {handleAlertError} from 'src/api/axios';

const RegisterOTPForm = ({
  onContinue = () => {},
  onJumpStep = () => {},
  phoneNumber,
  idUser = null,
}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors, insets);

  const ref = useRef({
    process: null,
    otpRef: null,
  }).current;

  const [code, setCode] = useState();
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    ref.process?.start();
    setTimeout(() => {
      ref.otpRef?.focusField(0);
    }, 300);
  }, [ref]);

  const restartCount = async () => {
    Keyboard.dismiss();
    refLoadingCpn?.show();
    const res = await resendRegisterCode(phoneNumber);

    await delay(1000);
    refLoadingCpn?.dismiss();

    setCode();

    ref.process?.start();
    setActive(false);
  };

  useEffect(() => {
    if (code && code?.length === 6) {
      verityOTP(code);
    }
  }, [code]);

  const verityOTP = async newCode => {
    try {
      Keyboard.dismiss();
      refLoadingCpn?.show();
      const res = await verifyOTP({
        id: idUser,
        code: newCode,
      });

      await delay(500);

      if (res.meta.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
        onContinue();
      } else {
        //bất kì error là gì thì cũng back lại
        showAlertCustomResponse({
          description: res.meta.error_message,
          onConfirm: () => onJumpStep(FORM.REGISTER_PHONE),
        });
      }
    } catch (error) {
      handleAlertError(error?.message);
    } finally {
      refLoadingCpn?.dismiss();
    }
  };

  return (
    <View style={styles.flex1}>
      <TextView keyLang="inputOTP" style={styles.title} />
      <TextView keyLang="inputSendTo" suffix={phoneNumber} style={styles.des} />
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
      <View style={styles.spaceBottom} />
    </View>
  );
};

export default memo(RegisterOTPForm);

const makeStyles = (colors, insets) => {
  return StyleSheet.create({
    flex1: {
      flex: 1,
      paddingTop: 20,
    },
    flex1Center: {
      flex: 1,
      justifyContent: 'center',
    },
    spaceBottom: {
      height: 30 + insets.bottom,
    },
    inputStyle: {height: 100},
    textButtonStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.white,
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
    resendText: {
      fontSize: AppFont.fontSize.s16,
    },
  });
};

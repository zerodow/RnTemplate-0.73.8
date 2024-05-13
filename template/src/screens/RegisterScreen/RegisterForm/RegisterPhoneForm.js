import {View, StyleSheet, Keyboard} from 'react-native';
import React, {memo} from 'react';
import {useForm} from 'react-hook-form';
import {useTheme} from '@react-navigation/native';
import TextView from 'src/components/TextView';
import {AppFont, RESPONSE_CODE} from 'src/utilities/constants';
import InputField from 'src/components/InputField';
import validate from 'src/utilities/validators/validate';
import Button from 'src/components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {registerRequestSchema} from 'src/api/schema/registerSchema';
import {resendRegisterCode, sendRegisterRequest} from 'src/api/auth';
import {refLoadingCpn} from 'src/routes';
import {delay} from 'src/utilities/helper/functional';
import {handleAlertError} from 'src/api/axios';
import {FORM, REGISTER_ERR_CODE} from 'src/utilities/constants/authConstant';
import useApi from 'src/hooks/useApi';

const RegisterPhoneForm = ({onContinue = () => {}, onJumpStep = () => {}}) => {
  const {sendRequest} = useApi({
    requestConfig: {
      showRefLoading: true,
    },
    apiFunc: sendRegisterRequest,
  });

  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const styles = makeStyles(colors, insets);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({mode: 'onBlur'});

  const onSend = async values => {
    const value = values.phoneNumber;

    const params = registerRequestSchema({
      phoneNumber: value,
    });

    const res = await sendRequest(params);

    if (!res) {
      return;
    }

    const dataNextStep = {
      phoneNumber: value,
      idUser: res?.data?.Id,
    };

    if (res.meta.error_code === REGISTER_ERR_CODE.SEND_OTP_FIRST) {
      //call otp sau đó sang màn nhập otp
      const response = await resendRegisterCode(value);
      if (response) {
        onContinue(dataNextStep);
      }
    } else if (res.meta.error_code === REGISTER_ERR_CODE.ENTERPASS) {
      //sang màn nhập mật khẩu
      onJumpStep(FORM.REGISTER_PASS, dataNextStep);
      //
    } else if (res.meta.error_code === REGISTER_ERR_CODE.CHOOSE_APART) {
      //sang màn chọn căn hộ
      onJumpStep(FORM.REGISTER_CHOOSE_APART, dataNextStep);
      //
    } else if (res.meta.error_code === REGISTER_ERR_CODE.WAIT_APPROVE) {
      onJumpStep(FORM.REGISTER_SUCCESS, dataNextStep);
      //
    } else if (res.meta.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
      //sang màn nhập otp
      onContinue(dataNextStep);
    } else {
      return handleAlertError(res.meta.error_message);
    }

    // Keyboard.dismiss();

    // try {
    //   const value = values.phoneNumber;
    //   refLoadingCpn?.show();

    //   const params = registerRequestSchema({
    //     phoneNumber: value,
    //   });

    //   const res = await sendRegisterRequest(params);

    //   if (!res) {
    //     return;
    //   }

    //   const dataNextStep = {
    //     phoneNumber: value,
    //     idUser: res?.data?.userId,
    //   };

    //   if (res.meta.error_code === REGISTER_ERR_CODE.SEND_OTP_FIRST) {
    //     //call otp sau đó sang màn nhập otp
    //     const response = await resendRegisterCode(value);
    //     if (response) {
    //       dismissIndicator();
    //       onContinue(dataNextStep);
    //     }
    //   } else if (res.meta.error_code === REGISTER_ERR_CODE.ENTERPASS) {
    //     //sang màn nhập mật khẩu
    //     refLoadingCpn?.dismiss();
    //     onJumpStep(FORM.REGISTER_PASS, dataNextStep);
    //     //
    //   } else if (res.meta.error_code === REGISTER_ERR_CODE.CHOOSE_APART) {
    //     //sang màn chọn căn hộ
    //     refLoadingCpn?.dismiss();
    //     onJumpStep(FORM.REGISTER_CHOOSE_APART, dataNextStep);
    //     //
    //   } else if (res.meta.error_code === REGISTER_ERR_CODE.WAIT_APPROVE) {
    //     refLoadingCpn?.dismiss();
    //     onJumpStep(FORM.REGISTER_SUCCESS, dataNextStep);
    //     //
    //   } else if (res.meta.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
    //     //sang màn nhập otp
    //     onContinue(dataNextStep);
    //     //
    //   } else {
    //     return handleAlertError(res.meta.error_message);
    //   }
    // } catch (error) {
    //   handleAlertError(error.message);
    // } finally {
    //   dismissIndicator();
    // }
  };

  const dismissIndicator = async () => {
    await delay(1000);
    refLoadingCpn?.dismiss();
    await delay(200);
  };

  return (
    <View style={styles.flex1}>
      <TextView keyLang="register" style={styles.title} />
      <TextView keyLang="welcome" style={styles.des} />
      <View style={styles.flex1Center}>
        <View style={styles.space} />
        <InputField
          label="phone"
          control={control}
          placeholder="phone"
          name="phoneNumber"
          rules={{
            validate: val => validate('phoneNumber', val),
          }}
          errorMessage={errors?.phoneNumber?.message}
          keyboardType="numeric"
        />
      </View>
      <Button
        text="continue"
        textStyle={styles.textButtonStyle}
        onPress={handleSubmit(onSend)}
      />
      <View style={styles.spaceBottom} />
    </View>
  );
};

export default memo(RegisterPhoneForm);

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
    space: {
      height: 20,
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
    },
    textButtonStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.white,
    },
  });
};

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
import {sendChangePassCode} from 'src/api/auth';
import {handleAlertError} from 'src/api/axios';
import useApi from 'src/hooks/useApi';
import {delay} from 'src/utilities/helper/functional';

const ForgotPhoneForm = ({onContinue = () => {}}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const styles = makeStyles(colors, insets);

  const {sendRequest} = useApi({
    requestConfig: {
      showRefLoading: true,
    },
    apiFunc: sendChangePassCode,
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({mode: 'onBlur'});

  const onSend = async values => {
    const value = values.phoneNumber;
    Keyboard.dismiss();
    const res = await sendRequest(value);
    await delay(300);

    const dataNextStep = {
      phoneNumber: value,
      idUser: res?.data?.userId,
    };

    if (res) {
      if (res.meta.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
        //sang màn nhập otp
        onContinue(dataNextStep);
      } else {
        return handleAlertError(res.meta.error_message);
      }
    }
  };

  return (
    <View style={styles.flex1}>
      <TextView keyLang="forgotPass" style={styles.title} />
      <TextView keyLang="inputPhoneReceiveOTP" style={styles.des} />
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

export default memo(ForgotPhoneForm);

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

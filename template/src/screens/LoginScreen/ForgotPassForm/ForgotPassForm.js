import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {useForm} from 'react-hook-form';
import {useTheme} from '@react-navigation/native';
import {AppFont} from 'src/utilities/constants/styleConstants';
import InputField from 'src/components/InputField';
import TextView from 'src/components/TextView';
import validate from 'src/utilities/validators/validate';
import Button from 'src/components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {newPasswordSchema} from 'src/api/schema/registerSchema';
import {createNewPass} from 'src/api/auth';
import {RESPONSE_CODE} from 'src/utilities/constants';
import {handleAlertError} from 'src/api/axios';
import {showAlertCustomResponse} from 'src/utilities/helper/functional';
import {t} from 'i18next';
import useApi from 'src/hooks/useApi';

const ForgotPassForm = ({onContinue = () => {}, idUser}) => {
  const {sendRequest} = useApi({
    requestConfig: {
      showRefLoading: true,
    },
    apiFunc: createNewPass,
  });

  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors, insets);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({mode: 'onBlur'});

  const submitNewPass = async values => {
    const params = newPasswordSchema({
      userId: idUser,
      newPassword: values.password,
    });

    const res = await sendRequest(params);

    if (!res) {
      return;
    }

    if (res?.meta?.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
      showAlertCustomResponse({
        title: t('changePassSuccess'),
        onConfirm: () => onContinue(),
      });
    } else {
      handleAlertError(res?.meta?.error_message);
    }
    // try {
    //   refLoadingCpn?.show();

    //   const params = newPasswordSchema({
    //     userId: idUser,
    //     newPassword: values.password,
    //   });

    //   const res = await createNewPass(params);
    //   if (res?.meta?.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
    //     showAlertCustomResponse({
    //       title: t('changePassSuccess'),
    //       onConfirm: () => onContinue(),
    //     });
    //   } else {
    //     handleAlertError(res?.meta?.error_message);
    //   }

    //   await delay(1000);
    //   refLoadingCpn?.dismiss();
    // } catch (error) {
    //   handleAlertError(error.message);
    // }
  };

  return (
    <View style={styles.flex1}>
      <TextView keyLang="inputPassNew" style={styles.title} />
      <View style={styles.flex1Center}>
        <InputField
          isPassword
          label="password"
          control={control}
          placeholder="inputPassNew"
          name="password"
          rules={{
            validate: val => validate('password', val),
          }}
          errorMessage={errors?.phoneNumber?.message}
        />
        <View style={styles.space} />
        <InputField
          isPassword
          label="passVerifyNew"
          control={control}
          placeholder="reEnterPassNew"
          name="reEnterPass"
          rules={{
            validate: val => validate('reEnterPass', val),
          }}
          errorMessage={errors?.password?.message}
        />
        <View style={styles.space} />
      </View>
      <Button
        text="continue"
        textStyle={styles.textButtonStyle}
        onPress={handleSubmit(submitNewPass)}
      />
      <View style={styles.spaceBottom} />
    </View>
  );
};

export default memo(ForgotPassForm);

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
    textButtonStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.white,
    },
  });
};

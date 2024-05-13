import {View, StyleSheet, Keyboard} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import InputField from 'src/components/InputField';
import {useForm} from 'react-hook-form';
import validate from 'src/utilities/validators/validate';
import Button from 'src/components/Button';
import {AppFont} from 'src/utilities/constants';
import {
  showAlertCustomResponse,
  showInfoAlert,
} from 'src/utilities/helper/functional';
import {t} from 'i18next';
import {newPasswordSchema} from 'src/api/schema/registerSchema';
import {useSelector} from 'react-redux';
import {changePassword} from 'src/api/auth';
import {goBack} from 'src/utilities/helper/navigationHelper';
import {refLoadingCpn} from 'src/routes';
import {handleAlertError} from 'src/api/axios';
import * as Keychain from 'react-native-keychain';

const ChangePass = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({mode: 'onBlur'});

  const userId = useSelector(state => state.AuthReducer.userId);

  const handleChangePass = async values => {
    const {currPass, newPass, renEnterNewPass} = values;
    if (newPass !== renEnterNewPass) {
      return showInfoAlert({
        title: t('changePassFail'),
        description: t('reInputPass'),
      });
    }
    if (currPass === newPass) {
      return showInfoAlert({
        title: t('changePassFail'),
        description: t('passMustDiff'),
      });
    }
    Keyboard.dismiss();
    try {
      refLoadingCpn?.show();

      const params = newPasswordSchema({
        userId,
        newPassword: newPass,
        currentPassword: currPass,
      });

      const res = await changePassword(params);

      console.log('res', res);

      if (res) {
        await Keychain.resetGenericPassword();
        return showAlertCustomResponse({
          confirmTitle: t('ok2'),
          title: t('success'),
          description: t('changePassSuccess'),
          onConfirm: () => goBack(),
        });
      }
    } catch (error) {
      handleAlertError(error.message);
    } finally {
      refLoadingCpn?.dismiss();
    }
  };

  return (
    <SafeViewWithBg customHeader={() => <Header title={'changePass'} />}>
      <View style={styles.container}>
        <View style={styles.flex1Center}>
          <InputField
            isPassword
            label="currPass"
            control={control}
            placeholder="currPass"
            name="currPass"
            rules={{
              validate: val => validate('currPass', val),
            }}
            errorMessage={errors?.currPass?.message}
          />
          <View style={styles.space} />
          <InputField
            isPassword
            label="newPass"
            control={control}
            placeholder="inputPassNew"
            name="newPass"
            rules={{
              validate: val => validate('newPass', val),
            }}
            errorMessage={errors?.newPass?.message}
          />
          <View style={styles.space} />
          <InputField
            isPassword
            label="renEnterNewPass"
            control={control}
            placeholder="reEnterPassNew"
            name="renEnterNewPass"
            rules={{
              validate: val => validate('renEnterNewPass', val),
            }}
            errorMessage={errors?.renEnterNewPass?.message}
          />
          <View style={styles.space} />
        </View>
        <Button
          text="continue"
          textStyle={styles.textButtonStyle}
          onPress={handleSubmit(handleChangePass)}
        />
      </View>
    </SafeViewWithBg>
  );
};

export default ChangePass;

const makeStyles = colors =>
  StyleSheet.create({
    container: {flex: 1, padding: 15},
    flex1Center: {
      flex: 1,
    },
    space: {
      height: 8,
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

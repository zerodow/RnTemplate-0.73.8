import {View, StyleSheet, Keyboard} from 'react-native';
import React, {memo} from 'react';
import {useForm} from 'react-hook-form';
import {useTheme} from '@react-navigation/native';
import TextView from 'src/components/TextView';
import {AppFont, RESPONSE_CODE} from 'src/utilities/constants';
import InputField from 'src/components/InputField';
import validate from 'src/utilities/validators/validate';
import Button from 'src/components/Button';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import {
  hitSlop,
  showAlertCustomResponse,
} from 'src/utilities/helper/functional';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import {handleAlertError} from 'src/api/axios';
import {refLoadingCpn} from 'src/routes';
import {activeApartmentRequest} from 'src/api/auth';
import {FORM} from 'src/utilities/constants/authConstant';

const RegisterApartForm = ({
  onContinue = () => {},
  onJump = () => {},
  idUser,
}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const styles = makeStyles(colors, insets);

  const {
    control,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm({mode: 'onBlur'});

  const handleContinue = async values => {
    Keyboard.dismiss();
    try {
      refLoadingCpn?.show();
      const res = await activeApartmentRequest({
        id: idUser,
        qrCode: values.apartCode,
      });
      console.log('res', res);
      if (!res) return;
      if (res?.meta?.error_code === RESPONSE_CODE.RESPONSE_SUCCESS) {
        onContinue();
      } else {
        showAlertCustomResponse({
          description: res?.meta?.error_message,
          onConfirm: () => onJump(FORM.REGISTER_PHONE),
        });
      }
    } catch (error) {
      handleAlertError(error.message);
    } finally {
      refLoadingCpn?.dismiss();
    }
  };

  const _onScanSuccess = val => {
    setValue('apartCode', val);
  };

  const goScanQR = () => {
    navigate(RouteName.QR_SCAN, {
      onScanSuccess: val => _onScanSuccess(val),
    });
  };

  return (
    <View style={styles.flex1}>
      <TextView keyLang="hi" style={styles.title} />
      <TextView keyLang="chooseApartDes" style={styles.des} />
      <View style={styles.flex1Center}>
        <View style={styles.v1}>
          <InputField
            containerStyle={styles.inputStyle}
            label="apartCode"
            control={control}
            placeholder="inputApartCode"
            name="apartCode"
            rules={{
              validate: val => validate('apartCode', val),
            }}
            errorMessage={errors?.apartCode?.message}
            maxLength={10}
          />
          <Icon
            source={IconSVG.qr}
            size={43}
            style={styles.icon}
            hitSlop={hitSlop(10)}
            onPress={goScanQR}
          />
        </View>
      </View>
      <Button
        text="continue"
        textStyle={styles.textButtonStyle}
        onPress={handleSubmit(handleContinue)}
      />
      <View style={styles.spaceBottom} />
    </View>
  );
};

export default memo(RegisterApartForm);

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
    v1: {flexDirection: 'row', alignItems: 'flex-end'},
    icon: {marginBottom: 15},
    inputStyle: {
      flex: 1,
      marginRight: 10,
    },
  });
};

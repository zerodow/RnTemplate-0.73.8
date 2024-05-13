import {View, StyleSheet, Keyboard} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTheme} from '@react-navigation/native';
import {AppFont} from 'src/utilities/constants/styleConstants';
import InputField from 'src/components/InputField';
import {Switch} from 'src/components/Switch';
import TextView from 'src/components/TextView';
import validate from 'src/utilities/validators/validate';
import Button from 'src/components/Button';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Keychain from 'react-native-keychain';

const LoginForm = ({onContinue = () => {}, onSubmitLogin = () => {}}, _ref) => {
  const {colors} = useTheme();

  const insets = useSafeAreaInsets();

  const styles = makeStyles(colors, insets);

  const [isRemember, setRemember] = useState(true);

  const {
    control,
    formState: {errors},
    handleSubmit,
    getValues,
    setValue,
  } = useForm({mode: 'onBlur'});

  useEffect(() => {
    getUserPassCache();
  }, []);

  const getUserPassCache = async () => {
    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        // console.log(
        //   'Credentials successfully loaded for user ' + credentials.username,
        // );
        if (credentials.username && credentials.password) {
          setValue('phoneNumber', credentials.username);
          setValue('password', credentials.password);
        }
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  const handleContinue = () => {
    onContinue();
  };

  const submitLogin = () => {
    Keyboard.dismiss();
    onSubmitLogin &&
      onSubmitLogin({
        phone: getValues('phoneNumber'),
        pass: getValues('password'),
        isRemember,
      });
  };

  return (
    <View style={styles.flex1}>
      <View style={styles.flex1Center}>
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
        <View style={styles.space2} />
        <InputField
          isPassword
          label="password"
          control={control}
          placeholder="password"
          name="password"
          rules={{
            validate: val => validate('password', val),
          }}
          errorMessage={errors?.password?.message}
        />
        <View style={styles.space2} />
        <View style={styles.v1}>
          <View style={styles.v2}>
            <Switch
              value={isRemember}
              onValueChange={val => setRemember(!isRemember)}
              circleSize={16}
              barHeight={20}
              switchWidthMultiplier={2.6}
              activeText=""
              inActiveText=""
              backgroundActive={colors.switchColor}
              circleBorderActiveColor={colors.switchColor}
              circleBorderInactiveColor={colors.white}
            />
            <TextView keyLang="rememberPass" style={{marginLeft: 10}} />
          </View>
          <TouchableDebounce onPress={handleContinue}>
            <TextView
              keyLang="forgotPass"
              suffix=" ?"
              style={styles.forgotText}
            />
          </TouchableDebounce>
        </View>
        <View style={styles.space2} />
      </View>
      <View style={styles.space2} />
      <View style={styles.space2} />
      <Button
        text="continue"
        textStyle={styles.textButtonStyle}
        onPress={handleSubmit(submitLogin)}
      />
      <View style={styles.spaceBottom} />
    </View>
  );
};

export default memo(LoginForm);

const makeStyles = (colors, insets) => {
  return StyleSheet.create({
    flex1: {
      flex: 1,
    },
    flex1Center: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    space2: {
      height: 10,
    },
    spaceBottom: {
      height: 30 + insets.bottom,
    },
    textButtonStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.white,
    },
    forgotText: {
      fontSize: AppFont.fontSize.s14,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary05,
      alignSelf: 'center',
      textDecorationLine: 'underline',
    },
    v1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    v2: {
      height: 30,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};

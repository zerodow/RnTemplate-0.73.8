import {View, StyleSheet, ScrollView, Alert, Keyboard} from 'react-native';
import React, {useCallback} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  calHeaderHeight,
  showAlertCustomResponse,
  showInfoAlert,
  uploadFile,
} from 'src/utilities/helper/functional';
import {useForm} from 'react-hook-form';
import InputField from 'src/components/InputField';
import {KeyboardAvoidingView} from 'react-native';
import Button from 'src/components/Button';
import InputDatePicker from 'src/components/InputDatePicker';
import moment from 'moment';
import validators from 'src/utilities/validators/validators';
import GroupCheckBox from 'src/components/GroupCheckBox';
import UserInfoValidators from 'src/utilities/validators/UserInfoValidators';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {AppStyles, GENDER_ARR, IMAGE_URL} from 'src/utilities/constants';
import {updateUserInfoSchema} from 'src/api/schema/otherSchema';
import {updateUserInfo} from 'src/api/other';
import UploadAvatar from './UploadAvatar';
import {refLoadingCpn} from 'src/routes';
import RNFetchBlob from 'rn-fetch-blob';
import {t} from 'i18next';
import {setUserInfo} from 'src/store/auth';
import {goBack} from 'src/utilities/helper/navigationHelper';
import {handleAlertError} from 'src/api/axios';
import {isIOS} from 'src/utilities/layout';

const UpdateInfo = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors);

  const dispatch = useDispatch();

  const userInfo = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const {
    control,
    formState: {errors},
    handleSubmit,
    getValues,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      fullName: userInfo.fullName,
      apart: userInfo.apartmentName,
      phone: userInfo.phone,
      email: userInfo.email,
      cardId: userInfo.cardId,
      birthday: userInfo.birthday,
      sex: userInfo.sex
        ? GENDER_ARR.find(item => item.code === userInfo.sex)
        : GENDER_ARR[0],
    },
  });

  const validate = useCallback(({fieldName, val}) => {
    return validators({
      fieldName,
      value: val,
      validation: UserInfoValidators,
    });
  }, []);

  const submit = async values => {
    Keyboard.dismiss();
    try {
      refLoadingCpn?.show();
      const params = updateUserInfoSchema({
        userId: userInfo.userId,
        fullName: values.fullName,
        sex: values.sex.code,
        birthday: values.birthday,
        cardId: values.cardId,
        email: values.email,
        avatar: userInfo.avata,
      });
      // console.log('params', params);
      const res = await updateUserInfo(params);

      if (res) {
        console.log('res', res);
        dispatch(
          setUserInfo({
            data: {
              ...userInfo,
              fullName: res.FullName,
              email: res.Email,
              cardId: res.CardId,
              birthday: res.Birthday,
              avata: res.Avata,
              sex: res.Sex,
            },
          }),
        );

        return showAlertCustomResponse({
          title: t('success'),
          description: t('updateInfoSuccess'),
          onConfirm: () => goBack(),
        });
      }
    } catch (error) {
      handleAlertError(error?.message);
    } finally {
      refLoadingCpn?.dismiss();
    }
  };

  const updateAvatarUser = file => {
    refLoadingCpn?.show();
    const params = [
      {
        name: 'images',
        filename: file.fileName,
        type: file.type,
        data: RNFetchBlob.wrap(file.uri.replace('file://', '')),
      },
    ];

    uploadFile(params)
      .then(res => {
        // upload thanh cong
        console.log('upload response', res);
        const isError = res.meta?.error_code || res.error_code;
        if (isError !== 200) {
          return Alert.alert(
            t('notification'),
            res.meta?.error_message || t('errUploadAva2'),
          );
        }
        if (res.data) {
          callUpdateAvatar(res.data[0]);
        }
      })
      .catch(e => {
        console.log('ERROR_UPLOAD_FILE', e);
        Alert.alert(t('notification'), t('errUploadAva'));
      })
      .finally(() => {
        refLoadingCpn?.dismiss();
      });
  };

  const callUpdateAvatar = async avatarUrl => {
    try {
      const values = getValues();
      console.log('userInfo', userInfo);
      const params = updateUserInfoSchema({
        userId: userInfo.userId,
        fullName: values.fullName || '',
        sex: values?.sex?.code || null,
        birthday: values?.birthday || null,
        cardId: values.cardId || '',
        email: values.email || '',
        avatar: avatarUrl,
      });

      const res = await updateUserInfo(params);

      if (res) {
        dispatch(
          setUserInfo({
            data: {
              ...userInfo,
              avata: avatarUrl,
            },
          }),
        );

        return showInfoAlert({
          title: t('success'),
          description: t('updateInfoSuccess'),
        });
      }
    } catch (error) {
      handleAlertError(error?.message);
    }
  };

  const renderHeader = () => {
    return (
      <View style={{flex: 1}}>
        <Header
          title={'myAcc'}
          containerStyle={[
            styles.headerContainerStyle,
            {
              height: calHeaderHeight(insets.top, true).height - 80,
            },
          ]}
        />
        <View style={styles.avatarContainer}>
          <UploadAvatar
            isEmpty={!userInfo?.avata}
            uri={`${IMAGE_URL}/${userInfo?.avata}`}
            onSuccess={updateAvatarUser}
            imgStyle={styles.avatarStyle}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeViewWithBg largeBackground customHeader={() => renderHeader()}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={isIOS ? 'padding' : null}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <InputField
              label="fullName"
              control={control}
              placeholder="fullName"
              name="fullName"
              rules={{
                validate: val =>
                  validate({
                    fieldName: 'fullName',
                    val,
                  }),
              }}
              errorMessage={errors?.fullName?.message}
              keyboardType="numeric"
              inputWrapperStyle={styles.newInputStyle}
            />
            <View style={styles.space2} />
            <InputField
              editable={false}
              label="phone"
              control={control}
              placeholder="phone"
              name="phone"
              errorMessage={errors?.phone?.message}
              inputWrapperStyle={styles.newInputStyle}
            />
            <View style={styles.space2} />
            <InputField
              editable={false}
              label="apart"
              control={control}
              placeholder="apart"
              name="apart"
              errorMessage={errors?.phone?.message}
              inputWrapperStyle={styles.newInputStyle}
            />
            <View style={styles.space2} />
            <InputDatePicker
              errorMessage={errors?.birthday?.message}
              label="birthday"
              name="birthday"
              control={control}
              placeholder="birthday"
              style={styles.v1}
              rules={{
                validate: val =>
                  validate({
                    fieldName: 'birthday',
                    val: moment(val, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                  }),
              }}
              inputWrapperStyle={styles.newInputStyle}
            />
            <View style={styles.space2} />
            <InputField
              label="email"
              control={control}
              placeholder="password"
              name="email"
              rules={{
                validate: val =>
                  validate({
                    fieldName: 'email',
                    val,
                  }),
              }}
              errorMessage={errors?.email?.message}
              inputWrapperStyle={styles.newInputStyle}
            />
            <View style={styles.space2} />
            <InputField
              label="cardId"
              control={control}
              placeholder="cardId"
              name="cardId"
              rules={{
                validate: val =>
                  validate({
                    fieldName: 'cardId',
                    val,
                  }),
              }}
              errorMessage={errors?.cardId?.message}
              inputWrapperStyle={styles.newInputStyle}
            />
            <View style={styles.space2} />
            <GroupCheckBox
              control={control}
              name="sex"
              title="sex"
              data={GENDER_ARR}
              style={styles.v1}
            />
            <View style={styles.space2} />
            <View style={styles.space2} />
            <View style={styles.space2} />
          </ScrollView>
          <Button text="save" onPress={handleSubmit(submit)} />
        </View>
      </KeyboardAvoidingView>
    </SafeViewWithBg>
  );
};

export default UpdateInfo;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
    },
    flex1: {flex: 1},
    avatarStyle: {
      width: 66,
      height: 66,
      borderRadius: 33,
    },
    headerContainerStyle: {
      alignItems: 'flex-end',
    },
    avatarContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    space2: {
      height: 5,
    },
    v1: {marginTop: 10},
    newInputStyle: {
      borderRadius: 8,
      ...AppStyles.shadow3,
    },
  });

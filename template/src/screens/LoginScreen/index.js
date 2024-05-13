import {
  View,
  StyleSheet,
  ImageBackground,
  LayoutAnimation,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import md5 from 'md5';
import RouteName from '../../routes/RouteName';
import {img} from '../../assets';
import Icon from '../../components/Icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {
  APP_LANGUAGE,
  AppFont,
  LANG_ID,
  RESPONSE_CODE,
} from '../../utilities/constants';
import TextView from '../../components/TextView';
import TouchableDebounce from '../../components/TouchableDebounce';
import LoginForm from './LoginForm/LoginForm';
import IconSVG from 'src/assets/icons/IconSVG';
import {
  deviceHeight,
  deviceWidth,
  isIOS,
  statusBarHeight,
} from 'src/utilities/layout';
import ForgotPhoneForm from './ForgotPassForm/ForgotPhoneForm';
import ForgotOTPForm from './ForgotPassForm/ForgotOTPForm';
import ForgotPassForm from './ForgotPassForm/ForgotPassForm';
import {goBack, navigate} from 'src/utilities/helper/navigationHelper';
import {loginSchema} from 'src/api/schema/authSchema';
import {loginApi, resendRegisterCode} from 'src/api/auth';
import {setAccessToken, setUserInfo} from 'src/store/auth';
import {showAlertConfirm} from 'src/utilities/helper/functional';
import {handleAlertError} from 'src/api/axios';
import {
  BORDER_HEIGHT,
  CIRCLE_LOGO_SIZE,
  FORM,
  LIST_REGISTER_ERR_CODE,
  REGISTER_ERR_CODE,
  STEP_BACK_MUST_CONFIRM,
  WHITE_SHAPE_HEIGHT,
  WHITE_SHAPE_WIDTH,
} from 'src/utilities/constants/authConstant';
import {changeLangAction} from 'src/store/app';
import {STORAGE_KEY, setLocalData} from 'src/utilities/helper/storageHelper';
import * as Keychain from 'react-native-keychain';
import useApi from 'src/hooks/useApi';

const LoginScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const styles = makeStyles(colors, insets);

  const ref = useRef({
    phone: null,
    idUser: null,
  }).current;

  const dispatch = useDispatch();
  const language = useSelector(state => state.AppReducer.language);

  const {sendRequest} = useApi({
    requestConfig: {
      showRefLoading: true,
    },
    apiFunc: loginApi,
  });

  const [form, setForm] = useState(FORM.LOGIN);

  const saveCache = async ({phone, pass, isRemember}) => {
    setLocalData({
      data: false,
      key: STORAGE_KEY.LOGIN_FIRST_TIME,
    });
    if (isRemember) {
      await Keychain.setGenericPassword(phone, pass);
    } else {
      await Keychain.resetGenericPassword();
    }
  };

  const onLogin = async ({phone, pass, isRemember}) => {
    const params = loginSchema({
      username: phone,
      password: md5(pass),
      locale: language,
      typeUser: 4,
    });

    const res = await sendRequest(params);

    if (!res) return;
    const errCode = res.meta?.error_code;
    if (errCode === RESPONSE_CODE.RESPONSE_SUCCESS) {
      saveCache({phone, pass, isRemember});
      dispatch(
        setUserInfo({
          data: res.data,
        }),
      );
      dispatch(
        changeLangAction({
          lang:
            res.data.languageId === LANG_ID.VI
              ? APP_LANGUAGE.VI
              : APP_LANGUAGE.EN,
        }),
      );
      dispatch(
        setAccessToken({
          token: res.data.access_token,
        }),
      );
      return;
    }
    if (LIST_REGISTER_ERR_CODE.includes(errCode)) {
      const dataPass = {
        errCode,
        idUser: res.data.userId || res.data.Id,
        phone: res.data.Phone,
      };
      //case 218 phải gọi send otp trước khi navigate
      //nếu api fail thì ko làm gì cả
      if (errCode === REGISTER_ERR_CODE.SEND_OTP_FIRST) {
        const response = await resendRegisterCode(dataPass.phone);

        if (!response) {
          return;
        }
      }
      return navigate(RouteName.REGISTER, dataPass);
    }
    handleAlertError(res.meta.error_message);
  };

  const onJump = (nextForm, dataNext) => {
    ref.phone = dataNext?.phoneNumber;
    ref.idUser = dataNext?.idUser;
    switch (nextForm) {
      case FORM.LOGIN:
        setForm(FORM.LOGIN);
        break;
      default:
        break;
    }
  };

  const onNext = dataNext => {
    isIOS && LayoutAnimation.easeInEaseOut();
    switch (form) {
      //FORGOT PASS FLOW
      case FORM.LOGIN:
        setForm(FORM.FORGOT_PASS_PHONE);
        break;
      case FORM.FORGOT_PASS_PHONE:
        ref.phone = dataNext?.phoneNumber;
        ref.idUser = dataNext?.idUser;
        setForm(FORM.FORGOT_PASS_OTP);
        break;
      case FORM.FORGOT_PASS_OTP:
        setForm(FORM.FORGOT_PASS_REENTER);
        break;
      case FORM.FORGOT_PASS_REENTER:
        setForm(FORM.LOGIN);
        break;

      //REGISTER FLOW
      case FORM.REGISTER_CHOOSE_APART:
        setForm(FORM.REGISTER_SUCCESS);
        break;
      case FORM.REGISTER_SUCCESS:
        setForm(FORM.LOGIN);
        break;

      default:
        break;
    }
  };

  const onBack = async () => {
    if (STEP_BACK_MUST_CONFIRM.includes(form)) {
      const status = await showAlertConfirm({
        description: 'Quá trình chưa hoàn tất, bạn có muốn quay lại không?',
      });
      if (status) {
        return setForm(FORM.LOGIN);
      }
    }
    isIOS && LayoutAnimation.easeInEaseOut();
    switch (form) {
      case FORM.LOGIN:
        goBack();
        break;
      //FORGOT PASS FLOW
      case FORM.FORGOT_PASS_PHONE:
        setForm(FORM.LOGIN);
        break;
      case FORM.FORGOT_PASS_OTP:
        setForm(FORM.FORGOT_PASS_PHONE);
        break;
      case FORM.FORGOT_PASS_REENTER:
        setForm(FORM.FORGOT_PASS_PHONE);
        break;

      default:
        break;
    }
  };

  const renderBackButton = () => {
    if (form === FORM.REGISTER_SUCCESS) return null;
    return (
      <View style={styles.top}>
        <TouchableDebounce onPress={onBack}>
          <Icon source={IconSVG.back} size={20} color={colors.white} />
        </TouchableDebounce>
        <TextView keyLang="welcome" style={styles.topTitle} />
        <View style={{height: 25}} />
      </View>
    );
  };

  const renderForm = () => {
    switch (form) {
      case FORM.LOGIN:
        return <LoginForm onContinue={onNext} onSubmitLogin={onLogin} />;

      //FORGOT PASS FLOW
      case FORM.FORGOT_PASS_PHONE:
        return <ForgotPhoneForm onContinue={onNext} />;
      case FORM.FORGOT_PASS_OTP:
        return (
          <ForgotOTPForm
            onContinue={onNext}
            phoneNumber={ref.phone}
            idUser={ref.idUser}
            onJump={onJump}
          />
        );
      case FORM.FORGOT_PASS_REENTER:
        return <ForgotPassForm onContinue={onNext} idUser={ref.idUser} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.flex1}>
      <ImageBackground source={img.bg2} style={styles.bgStyle}>
        {renderBackButton()}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView style={styles.flex1End} behavior={'padding'}>
            <ImageBackground
              resizeMode="stretch"
              source={img.bgSub}
              style={styles.bgSubStyle}>
              <View style={styles.flex1End}>
                <View style={styles.absoluteCircle}>
                  <Icon
                    source={img.circleLogo}
                    isImage
                    imgStyle={styles.circleLogoStyle}
                  />
                </View>
                <View style={styles.formStyle}>{renderForm()}</View>
              </View>
            </ImageBackground>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const makeStyles = (colors, insets) => {
  return StyleSheet.create({
    flex1: {
      flex: 1,
    },
    flex1End: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 10,
    },
    bgStyle: {
      width: deviceWidth,
      height: deviceHeight,
      paddingTop: insets.top || (!isIOS && 20),
      paddingBottom: 10,
    },
    bgSubStyle: {
      width: WHITE_SHAPE_WIDTH,
      height: WHITE_SHAPE_HEIGHT,
      alignSelf: 'center',
      paddingHorizontal: 10,
    },
    circleLogoStyle: {
      width: CIRCLE_LOGO_SIZE,
      height: CIRCLE_LOGO_SIZE,
    },
    absoluteCircle: {
      position: 'absolute',
      top: BORDER_HEIGHT - CIRCLE_LOGO_SIZE / 2,
      alignSelf: 'center',
    },
    formStyle: {
      height: WHITE_SHAPE_HEIGHT - (BORDER_HEIGHT + CIRCLE_LOGO_SIZE / 2),
      minHeight: 300,
      marginHorizontal: 30,
      justifyContent: 'center',
    },
    top: {
      flexDirection: 'row',
      height: 30,
      width: '100%',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    topTitle: {
      color: colors.white,
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
    },
  });
};

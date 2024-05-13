import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  LayoutAnimation,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppFont} from 'src/utilities/constants';
import {img} from 'src/assets';
import Icon from 'src/components/Icons';
import TouchableDebounce from 'src/components/TouchableDebounce';
import TextView from 'src/components/TextView';
import IconSVG from 'src/assets/icons/IconSVG';
import {
  deviceHeight,
  deviceWidth,
  isIOS,
  statusBarHeight,
} from 'src/utilities/layout';
import {goBack} from 'src/utilities/helper/navigationHelper';
import RegisterPhoneForm from './RegisterForm/RegisterPhoneForm';
import RegisterOTPForm from './RegisterForm/RegisterOTPForm';
import RegisterPassForm from './RegisterForm/RegisterPassForm';
import RegisterApartForm from './RegisterForm/RegisterApartForm';
import RegisterSuccess from './RegisterForm/RegisterSuccess';
import {delay, showAlertConfirm} from 'src/utilities/helper/functional';
import {
  BORDER_HEIGHT,
  CIRCLE_LOGO_SIZE,
  FORM,
  REGISTER_ERR_CODE,
  STEP_BACK_MUST_CONFIRM,
  WHITE_SHAPE_HEIGHT,
  WHITE_SHAPE_WIDTH,
} from 'src/utilities/constants/authConstant';

const RegisterScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const styles = makeStyles(colors, insets);

  const [form, setForm] = useState(FORM.REGISTER_PHONE);

  const ref = useRef({
    phone: null,
    idUser: null,
  }).current;

  //xử lý khi từ màn login sang
  //tương ứng mã lỗi sẽ nhảy vào form tương ứng
  useEffect(() => {
    if (route.params) {
      const {errCode, idUser, phone} = route.params;
      const data = {
        idUser,
        phone,
      };
      switch (errCode) {
        case REGISTER_ERR_CODE.SEND_OTP_FIRST:
          onJump(FORM.REGISTER_OTP, data);
          break;
        case REGISTER_ERR_CODE.ENTERPASS:
          onJump(FORM.REGISTER_PASS, data);
          break;
        case REGISTER_ERR_CODE.CHOOSE_APART:
          onJump(FORM.REGISTER_CHOOSE_APART, data);
          break;
        case REGISTER_ERR_CODE.WAIT_APPROVE:
          onJump(FORM.REGISTER_SUCCESS, data);
          break;
        default:
          break;
      }
    }
  }, [route.params]);

  const onJump = async (nextForm, dataNext) => {
    if (nextForm === FORM.REGISTER_OTP) {
      Keyboard.dismiss();
      await delay(400);
    }
    isIOS && LayoutAnimation.easeInEaseOut();
    ref.phone = dataNext?.phoneNumber;
    ref.idUser = dataNext?.idUser;
    switch (nextForm) {
      case FORM.REGISTER_OTP:
        setForm(FORM.REGISTER_OTP);
        break;
      case FORM.REGISTER_PASS:
        setForm(FORM.REGISTER_PASS);
        break;
      case FORM.REGISTER_CHOOSE_APART:
        setForm(FORM.REGISTER_CHOOSE_APART);
        break;
      case FORM.REGISTER_PHONE:
        setForm(FORM.REGISTER_PHONE);
        break;
      case FORM.REGISTER_SUCCESS:
        setForm(FORM.REGISTER_SUCCESS);
        break;
      default:
        break;
    }
  };

  const onNext = (dataNext = {}) => {
    isIOS && LayoutAnimation.easeInEaseOut();
    switch (form) {
      //REGISTER FLOW
      case FORM.REGISTER_PHONE:
        ref.phone = dataNext?.phoneNumber;
        ref.idUser = dataNext?.idUser;
        setForm(FORM.REGISTER_OTP);
        break;
      case FORM.REGISTER_OTP:
        setForm(FORM.REGISTER_PASS);
        break;
      case FORM.REGISTER_PASS:
        setForm(FORM.REGISTER_CHOOSE_APART);
        break;
      case FORM.REGISTER_CHOOSE_APART:
        setForm(FORM.REGISTER_SUCCESS);
        break;
      case FORM.REGISTER_SUCCESS:
        goBack();
        break;

      default:
        break;
    }
  };

  const onBack = async () => {
    if (STEP_BACK_MUST_CONFIRM.includes(form)) {
      const status = await showAlertConfirm({
        description:
          'Quá trình đăng ký chưa hoàn tất, bạn có muốn quay lại không?',
      });
      if (status) {
        return route.params ? goBack() : setForm(FORM.REGISTER_PHONE);
      }
    }
    isIOS && LayoutAnimation.easeInEaseOut();
    switch (form) {
      //REGISTER FLOW
      case FORM.REGISTER_PHONE:
        goBack();
        break;
      case FORM.REGISTER_OTP:
        setForm(FORM.REGISTER_PHONE);
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
      case FORM.REGISTER_PHONE:
        return <RegisterPhoneForm onContinue={onNext} onJumpStep={onJump} />;
      case FORM.REGISTER_OTP:
        return (
          <RegisterOTPForm
            onContinue={onNext}
            phoneNumber={ref.phone}
            idUser={ref.idUser}
            onJumpStep={onJump}
          />
        );
      case FORM.REGISTER_PASS:
        return <RegisterPassForm onContinue={onNext} idUser={ref.idUser} />;
      case FORM.REGISTER_CHOOSE_APART:
        return <RegisterApartForm onContinue={onNext} idUser={ref.idUser} />;
      case FORM.REGISTER_SUCCESS:
        return <RegisterSuccess onContinue={onNext} />;
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

export default RegisterScreen;

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

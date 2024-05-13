import {View, LayoutAnimation, StyleSheet, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {img} from 'src/assets';
import {deviceHeight, deviceWidth} from 'src/utilities/layout';
import Icon from 'src/components/Icons';
import Button from 'src/components/Button';
import TouchableDebounce from 'src/components/TouchableDebounce';
import TextView from 'src/components/TextView';
import {APP_LANGUAGE, AppColors, AppFont} from 'src/utilities/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import SplashScreen from 'react-native-splash-screen';
import {delay} from 'src/utilities/helper/functional';
// import messaging from '@react-native-firebase/messaging';
import {
  STORAGE_KEY,
  getLocalData,
  setLocalData,
} from 'src/utilities/helper/storageHelper';
import CustomIndicator from 'src/components/CustomIndicator';
import axios from 'axios';
import i18n from 'src/assets/I18n';
import {getVersionConfig} from 'src/api/other';
import {useDispatch, useSelector} from 'react-redux';
import {setLangVersionAction} from 'src/store/app';

const Welcome = () => {
  const {colors} = useTheme();
  const insest = useSafeAreaInsets();
  const styles = makeStyles(colors, insest);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const langVersion = useSelector(state => state.AppReducer.langVersion);

  useEffect(() => {
    getLocalCache();
    // loadHandle();
  }, []);

  const loadHandle = async () => {
    try {
      await delay(2000);
      const langServerVersion = await getConfigVersion();

      //nếu langServerVersion > langVersion
      if (!langVersion || langServerVersion > langVersion) {
        const status = await getServerLang();
        //get thành công thì update langVersion của redux
        if (status) {
          dispatch(setLangVersionAction({langVersion: langServerVersion}));
        }
      } else {
        await getLocalLang();
      }
    } catch (error) {
    } finally {
      getLocalCache();
    }
  };

  const getConfigVersion = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await getVersionConfig();
        console.log('rés', res);

        if (!res) {
          return reject(0);
        }
        const langVer = Number(res.LanguageVersion);

        resolve(langVer);
      } catch (error) {
        reject(0);
      }
    });
  };

  const getServerLang = () => {
    return new Promise((resolve, reject) => {
      axios
        .get('http://localhost:3000/translation')
        .then(response => {
          // console.log('response', response);
          const translations = response.data;
          // console.log('translations', translations);
          //set lang to async storage
          setLocalData({
            key: STORAGE_KEY.LANG,
            data: translations,
          });
          //add to resource
          addResourceLang(translations);
          resolve(true);
        })
        .catch(error => {
          console.log('error', error);
          reject(false);
        });
    });
    // getLocalCache();
  };

  const getLocalLang = async () => {
    return new Promise(async (resolve, reject) => {
      const translations = await getLocalData({key: STORAGE_KEY.LANG});
      console.log('translations', translations);
      addResourceLang(translations);
      resolve(true);
    });
  };

  const addResourceLang = translations => {
    i18n.addResources(APP_LANGUAGE.VI, 'translation', translations.vi);
    i18n.addResources(APP_LANGUAGE.EN, 'translation', translations.en);
  };

  const getLocalCache = async () => {
    SplashScreen.hide();
    // await messaging().requestPermission();
    const res = await getLocalData({
      key: STORAGE_KEY.LOGIN_FIRST_TIME,
    });
    LayoutAnimation.linear();
    setLoading(false);
    if (res === false) {
      return navigate(RouteName.LOGIN);
    }
  };

  const goPolicy = () => {};

  const onGoLogin = () => {
    navigate(RouteName.LOGIN);
  };

  const onGoRegister = () => {
    navigate(RouteName.REGISTER);
  };

  const renderButton = () => {
    if (loading) {
      return (
        <View style={styles.v2}>
          <CustomIndicator isEmpty isLarge color={AppColors.white} />
        </View>
      );
    }
    return (
      <View style={styles.v2}>
        <Button
          text="login"
          containerStyle={styles.loginBtn}
          textStyle={styles.textLoginStyle}
          onPress={onGoLogin}
        />
        <Button
          text="register"
          containerStyle={styles.registerBtn}
          textStyle={styles.textRegisterStyle}
          onPress={onGoRegister}
        />
        <TouchableDebounce onPress={goPolicy}>
          <TextView keyLang="policy" style={styles.title2} />
        </TouchableDebounce>
      </View>
    );
  };

  return (
    <View style={styles.flex1}>
      <ImageBackground
        resizeMode="stretch"
        source={img.wallPaper}
        style={styles.container}>
        <View style={styles.flex1}>
          <View style={styles.v1}>
            <Icon
              isImage
              source={img.logo}
              width={deviceWidth / 3}
              height={deviceWidth / 3 / 1.24}
            />
          </View>
          <View style={styles.v1}>
            <Icon
              isImage
              source={img.drop}
              width={deviceWidth / 1.5}
              height={deviceWidth / 1.5 / 1.26}
            />
            <TextView keyLang="welcome" style={styles.title1} />
          </View>
          {renderButton()}
        </View>
      </ImageBackground>
    </View>
  );
};

export default Welcome;

const makeStyles = (colors, insest) =>
  StyleSheet.create({
    flex1: {
      flex: 1,
    },
    v1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    v2: {
      flex: 1.5,
      alignSelf: 'center',
      width: deviceWidth - 90,
      paddingBottom: insest.bottom + 30,
      justifyContent: 'flex-end',
    },
    loginBtn: {},
    textLoginStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.white,
    },
    textRegisterStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.homeIcon,
    },
    registerBtn: {
      marginTop: 20,
      backgroundColor: colors.btnSecondBg,
    },
    container: {
      width: deviceWidth,
      height: deviceHeight,
      paddingBottom: 10,
    },
    title1: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
      color: colors.white,
      alignSelf: 'center',
      marginTop: 8,
    },
    title2: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
      color: colors.white,
      textDecorationLine: 'underline',
      alignSelf: 'center',
      marginTop: 30,
    },
  });

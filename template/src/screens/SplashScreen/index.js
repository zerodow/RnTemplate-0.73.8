import {
  View,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {img} from '../../assets';
import {
  deviceHeight,
  deviceWidth,
  statusBarHeight,
} from '../../utilities/layout';
import Icon from '../../components/Icons';
import {delay} from '../../utilities/helper/functional';
import {navigate, replace} from '../../utilities/helper/navigationHelper';
import RouteName from '../../routes/RouteName';
import {AppColors} from '../../utilities/constants';
// import messaging from '@react-native-firebase/messaging';
import {STORAGE_KEY, getLocalData} from 'src/utilities/helper/storageHelper';
import axios from 'axios';
import i18next from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';

const SplashScreen = () => {
  const [loading, setLoading] = useState();

  const loadHandle = async () => {
    await delay(2000);
    setLoading(true);
    getTranslation();
    // await delay(5000);
    // setLoading(false);
    // replace(RouteName.LOGIN);
  };

  useEffect(() => {
    loadHandle();
    // getLocalCache();
    // getTranslation();
  }, []);

  const getTranslation = () => {
    // axios
    //   .get('http://localhost:3000/translation')
    //   .then(response => {
    //     console.log('response', response);
    //     const translations = response.data;

    //     i18next
    //       .use(I18NextHttpBackend)
    //       .init({
    //         backend: {
    //           // Use the translations fetched from the URL
    //           backend: translations,
    //         },
    //         // ...other configuration options...
    //       })
    //       .then(() => {
    //         console.log('aihihi');
    //         getLocalCache();
    //         // Translations have been loaded
    //         // You can start using i18next in your application
    //       })
    //       .catch(error => {
    //         console.log('error', error);
    //         // Handle any errors that occurred during the initialization
    //       });
    //   })
    //   .catch(error => {
    //     console.log('error', error);
    //     // Handle any errors that occurred during the HTTP request
    //   });
    getLocalCache();
  };

  const getLocalCache = async () => {
    // const authStatus = await messaging().requestPermission();
    const res = await getLocalData({
      key: STORAGE_KEY.LOGIN_FIRST_TIME,
    });

    if (res === false) {
      replace(RouteName.WELCOME);
      return navigate(RouteName.LOGIN);
    }

    setLoading(false);
    navigate(RouteName.WELCOME);
  };

  const renderLoading = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size={'large'} color={AppColors.white} />
      </View>
    );
  };

  return (
    <View style={styles.flex1}>
      <ImageBackground
        resizeMode="stretch"
        source={img.wallPaper}
        style={{width: deviceWidth, height: deviceHeight}}>
        <View style={styles.flex1}>
          {renderLoading()}
          <View style={styles.top}>
            <Icon
              isImage
              source={img.logo}
              width={deviceWidth / 2}
              height={deviceWidth / 2 / 1.24}
            />
          </View>
          <View style={styles.bot}>
            <Icon
              isImage
              source={img.drop}
              width={deviceWidth / 1.5}
              height={deviceWidth / 1.5 / 1.26}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loadingWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    top: deviceHeight / 2 - 10,
  },
});

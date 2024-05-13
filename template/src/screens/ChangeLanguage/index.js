import {View, StyleSheet, FlatList, Alert} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import {
  APP_LANGUAGE,
  AppFont,
  AppStyles,
  LANG_ID,
} from 'src/utilities/constants';
import IconSVG from 'src/assets/icons/IconSVG';
import Icon from 'src/components/Icons';
import TextView from 'src/components/TextView';
import {useDispatch, useSelector} from 'react-redux';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {changeLangSchema} from 'src/api/schema/otherSchema';
import {changeLanguageRequest} from 'src/api/other';
import {changeLangAction} from 'src/store/app';
import {refLoadingCpn} from 'src/routes';
import {img} from 'src/assets';
import {setAccessToken} from 'src/store/auth';

const arr = [
  {image: img.vi, title: 'vi', value: APP_LANGUAGE.VI},
  {image: img.en, title: 'en', value: APP_LANGUAGE.EN},
];
const ChangeLanguage = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const dispatch = useDispatch();
  const language = useSelector(state => state.AppReducer.language);
  const userId = useSelector(state => state.AuthReducer.userId);

  const callChangeLang = async item => {
    if (language === item.value) return;
    refLoadingCpn?.show();
    const params = changeLangSchema({
      userId,
      languageId: item.value === APP_LANGUAGE.VI ? LANG_ID.VI : LANG_ID.EN,
    });
    // console.log('params', params);
    const res = await changeLanguageRequest(params);
    // console.log('res', res);
    if (res) {
      //replace token
      dispatch(
        setAccessToken({
          token: res,
        }),
      );
      dispatch(
        changeLangAction({
          lang: item.value,
        }),
      );
    }
    refLoadingCpn?.dismiss();
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableDebounce
        onPress={() => callChangeLang(item)}
        style={[
          styles.row,
          {
            backgroundColor:
              language === item.value ? colors.btnSecondBg : colors.white,
          },
        ]}>
        <Icon isImage source={item.image} />
        <View style={{flex: 1, marginHorizontal: 15}}>
          <TextView style={styles.titleStyle} keyLang={item.title} />
        </View>
        {language === item.value && <Icon source={IconSVG.success} size={24} />}
      </TouchableDebounce>
    );
  };

  return (
    <SafeViewWithBg customHeader={() => <Header title={'lang'} />}>
      <View style={styles.container}>
        <View style={styles.paper}>
          <FlatList
            data={arr}
            keyExtractor={(item, index) => index + ''}
            renderItem={_renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeViewWithBg>
  );
};

export default ChangeLanguage;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
    },
    paper: {
      marginTop: 20,
      marginHorizontal: 15,
      paddingVertical: 20,
      borderRadius: 9,
      backgroundColor: 'white',
      ...AppStyles.shadow2,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
    },
  });

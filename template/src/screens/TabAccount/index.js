import {View, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useTheme} from '@react-navigation/native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {logoutAction} from '../../store/auth';
import {bgHeaderFullHeight, deviceWidth} from 'src/utilities/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppFont} from 'src/utilities/constants';
import AbsoluteView from './components/AbsoluteView';
import {listFeature} from './FeatureConfig';
import ItemFeature from './components/ItemFeature';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import AlertCustom from 'src/components/AlertCustom';
import {t} from 'i18next';
import OTPModal from './components/OTPModal';
import {handleAlertError} from 'src/api/axios';
import {deleteAccount} from 'src/api/auth';
import {showAlertCustomResponse} from 'src/utilities/helper/functional';
import {deleteTokenFcm} from 'src/api/noti';
import {deleteTokenSchema} from 'src/api/schema/otherSchema';

const TabAccount = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const styles = makeStyles(colors, insets);

  const dispatch = useDispatch();

  const userInfo = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const ref = useRef({
    alertLogout: null,
    alertDel: null,
    otpModal: null,
  }).current;

  const logoutHandle = async () => {
    // const res = await deleteTokenFcm(deleteTokenSchema());

    dispatch(logoutAction());
  };

  const delAccHandle = () => {
    ref.otpModal?.show();
  };

  const callDeleteAcc = async () => {
    try {
      const res = await deleteAccount({
        userId: userInfo.userId,
        apartId: userInfo.apartmentId,
      });

      if (res) {
        showAlertCustomResponse({
          title: t('success'),
          description: t('delSuccess'),
          confirmTitle: t('ok2'),
          onConfirm: () => logoutHandle(),
        });
      }
    } catch (error) {
      handleAlertError(error?.message);
    }
  };

  const _renderItem = ({item, index}) => {
    return (
      <ItemFeature
        item={item}
        index={index}
        onLogout={() => ref.alertLogout?.show()}
        onDeleteAcc={() => ref.alertDel?.show()}
      />
    );
  };

  return (
    <SafeViewWithBg
      largeBackground
      customHeader={() => <Header isLargeBg title={'account'} noLeftIcon />}>
      <AbsoluteView />
      <View style={styles.container}>
        <FlatList
          data={listFeature}
          keyExtractor={(item, index) => index + ''}
          renderItem={_renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <AlertCustom
        description={t('confirmLogout')}
        title={t('logout').toUpperCase()}
        ref={r => (ref.alertLogout = r)}
        confirmTitle={'yes'}
        cancelTitle={'no'}
        onConfirm={logoutHandle}
      />
      <AlertCustom
        description={t('confirmDel')}
        title={t('deleteAcc').toUpperCase()}
        ref={r => (ref.alertDel = r)}
        confirmTitle={'yes'}
        cancelTitle={'no'}
        onConfirm={delAccHandle}
      />
      <OTPModal ref={r => (ref.otpModal = r)} onContinue={callDeleteAcc} />
    </SafeViewWithBg>
  );
};

export default TabAccount;

const makeStyles = (colors, insets) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: 'white', marginTop: 40},
    title: {
      color: colors.white,
      fontSize: AppFont.fontSize.s18,
      fontWeight: AppFont.fontWeight.superBold,
    },
    btn: {
      backgroundColor: 'red',
      paddingHorizontal: 30,
      paddingVertical: 10,
      marginTop: 20,
    },
    bgContainer: {
      width: deviceWidth,
      height: bgHeaderFullHeight,
    },
    header: {
      marginTop: insets.top + 10,
      flexDirection: 'row',
      paddingHorizontal: 25,
      justifyContent: 'space-between',
    },
  });

import {View, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  bgHeaderFullHeight,
  bgHeaderFullHeightForSmallTop,
} from 'src/utilities/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppFont, AppStyles} from 'src/utilities/constants';
import TextView from 'src/components/TextView';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import ImageView from 'src/components/ImageView';
import {shallowEqual, useSelector} from 'react-redux';
import {
  ROLE_USER,
  ROLE_USER_MAPPING,
} from 'src/utilities/constants/authConstant';

const AbsoluteInfo = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const styles = makeStyles(colors, insets);

  const userInfo = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const type = useSelector(state => state.AuthReducer.type);

  const position = useMemo(
    () => ROLE_USER_MAPPING.find(item => item.type === type) || {title: 'Test'},
    [type],
  );

  return (
    <View style={[styles.container, AppStyles.shadow2]}>
      <ImageView uri={userInfo?.avata} style={styles.circleImage} isAvatar />
      <View style={styles.flex1}>
        <TextView numberOfLines={1} style={styles.titleStyle}>
          {userInfo.fullName}
        </TextView>
      </View>
      <View style={styles.row}>
        {type === ROLE_USER.HOUSE_HOLD && (
          <Icon source={IconSVG.star} style={styles.form} size={12} />
        )}
        <TextView keyLang={position.title} style={styles.v1} />
      </View>
    </View>
  );
};

export default AbsoluteInfo;

const makeStyles = (colors, insets) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 15,
      right: 15,
      top:
        insets.top <= 25
          ? bgHeaderFullHeightForSmallTop - 30
          : bgHeaderFullHeight - 30,
      borderRadius: 15,
      height: 60,
      backgroundColor: colors.white,
      zIndex: 20,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    flex1: {flex: 1, marginLeft: 10},
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    circleImage: {
      borderRadius: 25,
      width: 50,
      height: 50,
      // backgroundColor: 'red',
    },
    v1: {
      color: colors.primary05,
      fontSize: AppFont.fontSize.s15,
      fontWeight: AppFont.fontWeight.regular,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s17,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary05,
    },
    form: {marginRight: 5, alignSelf: 'center'},
  });

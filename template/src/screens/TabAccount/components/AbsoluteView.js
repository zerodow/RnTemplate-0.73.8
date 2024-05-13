import {View, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  bgHeaderFullHeight,
  bgHeaderFullHeightForSmallTop,
  deviceWidth,
} from 'src/utilities/layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppFont, AppStyles} from 'src/utilities/constants';
import TextView from 'src/components/TextView';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import ImageView from 'src/components/ImageView';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import {shallowEqual, useSelector} from 'react-redux';
import {
  ROLE_USER,
  ROLE_USER_MAPPING,
} from 'src/utilities/constants/authConstant';

const AbsoluteView = () => {
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

  const goEditInfo = () => {
    navigate(RouteName.UPDATE_INFO);
  };

  return (
    <View style={[styles.container, AppStyles.shadow2]}>
      <View style={styles.row}>
        <TextView style={styles.v1}>{userInfo.phone}</TextView>
        <View style={styles.row}>
          {type === ROLE_USER.HOUSE_HOLD && (
            <Icon source={IconSVG.star} style={styles.icon} size={12} />
          )}
          <TextView keyLang={position.title} style={styles.v1} />
        </View>
      </View>
      <View style={styles.row}>
        <TextView numberOfLines={1} style={styles.v2}>
          {userInfo.fullName}
        </TextView>
        <TextView numberOfLines={1} style={styles.v3}>
          {userInfo.apartmentName}
        </TextView>
      </View>
      <TouchableDebounce style={styles.circleImage} onPress={goEditInfo}>
        <ImageView uri={userInfo?.avata} style={styles.avatarStyle} isAvatar />
      </TouchableDebounce>
    </View>
  );
};

export default AbsoluteView;

const makeStyles = (colors, insets) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: 20,
      right: 20,
      top:
        insets.top <= 25
          ? bgHeaderFullHeightForSmallTop - 35
          : bgHeaderFullHeight - 35,
      borderRadius: 15,
      height: 70,
      backgroundColor: colors.white,
      zIndex: 20,
      paddingHorizontal: 7,
      paddingVertical: 10,
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
    },
    circleImage: {
      position: 'absolute',
      top: -36,
      alignSelf: 'center',
      width: 72,
      height: 72,
    },
    avatarStyle: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },
    editStyle: {position: 'absolute', bottom: 0, right: 0, zIndex: 10},
    v1: {
      color: colors.primary05,
    },
    v2: {
      color: colors.homeIcon,
      fontSize: AppFont.fontSize.s17,
      fontWeight: AppFont.fontWeight.superBold,
      maxWidth: deviceWidth / 2.5,
    },
    v3: {
      color: colors.homeIcon,
      fontSize: AppFont.fontSize.s16,
      maxWidth: deviceWidth / 2.5,
    },
    icon: {marginRight: 5, alignSelf: 'center'},
  });

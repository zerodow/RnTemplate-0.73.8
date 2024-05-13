import {View, Linking, StyleSheet} from 'react-native';
import React from 'react';
import {deviceWidth} from 'src/utilities/layout';
import TextView from 'src/components/TextView';
import TouchableDebounce from 'src/components/TouchableDebounce';
import IconSVG from 'src/assets/icons/IconSVG';
import Icon from 'src/components/Icons';
import {AppFont} from 'src/utilities/constants';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {callFunc, mailFunc} from 'src/utilities/helper/functional';

const BottomView = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const styles = makeStyles(colors, insets);

  const phone = '18001234';

  const mail = 'help@ibuilding.com';

  const onCall = () => {
    callFunc(phone);
  };

  const onMail = () => {
    mailFunc(mail);
  };

  return (
    <View style={styles.bottomWrapper}>
      <TextView style={styles.title} keyLang="contactManager" />
      <View style={styles.row}>
        <TouchableDebounce style={styles.btn1} onPress={onCall}>
          <Icon source={IconSVG.call} color={colors.white} size={18} />
          <TextView numberOfLines={1} style={styles.phone}>
            {phone}
          </TextView>
        </TouchableDebounce>
        <TouchableDebounce style={styles.btn2} onPress={onMail}>
          <Icon source={IconSVG.mail} color={colors.white} size={22} />
          <TextView numberOfLines={1} style={styles.mail}>
            {mail}
          </TextView>
        </TouchableDebounce>
      </View>
    </View>
  );
};

export default BottomView;

const makeStyles = (colors, insets) =>
  StyleSheet.create({
    bottomWrapper: {
      backgroundColor: colors.btnSecondBg,
      width: deviceWidth,
      height: 100,
      paddingHorizontal: 15,
      paddingBottom: insets?.bottom || 0,
    },
    row: {flexDirection: 'row'},
    title: {
      paddingVertical: 15,
      color: colors.neutral3,
      fontSize: AppFont.fontSize.s14,
      textAlign: 'center',
    },
    btn1: {
      backgroundColor: colors.primary4,
      flexDirection: 'row',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 15,
      justifyContent: 'space-around',
      flex: 1,
      alignItems: 'center',
    },
    btn2: {
      backgroundColor: colors.primary1,
      flexDirection: 'row',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 15,
      justifyContent: 'space-around',
      flex: 1.6,
      marginLeft: 10,
      alignItems: 'center',
    },
    phone: {
      fontSize: AppFont.fontSize.s15,
      color: colors.white,
      marginLeft: 10,
      fontWeight: AppFont.fontWeight.bold,
    },
    mail: {
      fontSize: AppFont.fontSize.s15,
      color: colors.white,
      fontWeight: AppFont.fontWeight.bold,
    },
  });

import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {useTheme} from '@react-navigation/native';
import TextView from 'src/components/TextView';
import {AppFont} from 'src/utilities/constants';
import Button from 'src/components/Button';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const RegisterSuccess = ({onContinue = () => {}}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors, insets);

  const handleContinue = () => {
    onContinue();
  };

  return (
    <View style={styles.flex1}>
      <TextView keyLang="waitReview" style={styles.title} />
      <TextView keyLang="waitReviewDes" style={styles.des} />
      <View style={styles.flex1Center}>
        <Icon source={IconSVG.wait} size={120} />
      </View>
      <Button
        text="backToLogin"
        textStyle={styles.textButtonStyle}
        onPress={handleContinue}
      />
      <View style={styles.spaceBottom} />
    </View>
  );
};

export default memo(RegisterSuccess);

const makeStyles = (colors, insets) => {
  return StyleSheet.create({
    flex1: {
      flex: 1,
      paddingTop: 20,
    },
    flex1Center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spaceBottom: {
      height: 30 + insets.bottom,
    },
    space: {
      height: 20,
    },
    title: {
      fontSize: AppFont.fontSize.s20,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.homeIcon,
      alignSelf: 'center',
    },
    des: {
      fontSize: AppFont.fontSize.s16,
      alignSelf: 'center',
      marginTop: 15,
      textAlign: 'center',
    },
    textButtonStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.white,
    },
  });
};

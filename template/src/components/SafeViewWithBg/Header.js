import {View, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import Icon from '../Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import TextView from '../TextView';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppFont} from 'src/utilities/constants';
import {goBack} from 'src/utilities/helper/navigationHelper';
import {hitSlop} from 'src/utilities/helper/functional';

const Header = ({
  noLeftIcon = false,
  leftIcon = IconSVG.back,
  onLeftPress,
  rightIcon,
  customRenderRight,
  onRightPress,
  title,
  isLargeBg = false,
  containerStyle = {},
}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors, insets);

  const handleLeftPress = () => {
    if (onLeftPress) {
      return onLeftPress();
    }
    goBack();
  };

  const handleRightPress = () => {
    if (onRightPress) {
      return onRightPress();
    }
  };

  const renderLeft = () => {
    if (noLeftIcon) {
      return <View style={styles.blank} />;
    }
    return <Icon source={leftIcon} size={22} onPress={handleLeftPress} />;
  };

  const renderRight = () => {
    if (customRenderRight) {
      return customRenderRight();
    }
    if (!rightIcon) {
      return <View style={styles.blank} />;
    }

    return (
      <Icon
        hitSlop={hitSlop(10)}
        source={rightIcon}
        size={22}
        onPress={handleRightPress}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        isLargeBg && {paddingBottom: 50},
        containerStyle,
      ]}>
      {renderLeft()}
      <TextView keyLang={title} style={styles.title} />
      {renderRight()}
    </View>
  );
};

export default Header;

const makeStyles = (colors, insets) => {
  //top <= 20 thì cộng theoe 20
  //> 20 như ip 14 thì giữ nguyên
  // const paddingTopOfHeader =
  // insets.top <= 25 ? insets.top + 20 : insets.top + 10;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      justifyContent: 'space-between',
      height: '100%',
      alignItems: 'center',
    },
    title: {
      color: colors.white,
      fontSize: AppFont.fontSize.s18,
      fontWeight: AppFont.fontWeight.superBold,
    },
    blank: {
      width: 22,
    },
  });
};

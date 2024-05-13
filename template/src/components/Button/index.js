import React, {memo} from 'react';
import {Platform, StyleSheet} from 'react-native';
import TouchableDebounce from '../TouchableDebounce';
import TextView from '../TextView';
import {AppFont} from '../../utilities/constants';
import {useTheme} from '@react-navigation/native';

const Button = (
  props = {
    onPress: () => {},
    containerStyle: {},
    textStyle: {},
    text: '',
    disabled: Boolean,
  },
) => {
  const {onPress, containerStyle, textStyle, text, disabled = false} = props;
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableDebounce
      {...props}
      onPress={onPress}
      style={[styles.container, containerStyle]}>
      <TextView
        keyLang={text}
        style={[styles.text, textStyle, disabled && {opacity: 0.45}]}
      />
    </TouchableDebounce>
  );
};

export default memo(Button);

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      height: 45,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      // borderColor: colors.borderInput,
      // borderWidth: 1,
      paddingBottom: Platform.select({
        ios: 0,
        android: 2,
      }),
      backgroundColor: colors.homeIcon,
    },
    text: {
      color: colors.white,
      fontSize: AppFont.fontSize.s13,
      lineHeight: AppFont.fontSize.s13 * 1.5,
    },
  });

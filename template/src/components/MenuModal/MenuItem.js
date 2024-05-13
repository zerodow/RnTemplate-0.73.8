import React from 'react';

import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import TextView from '../TextView';
import TouchableDebounce from '../TouchableDebounce';
import Icon from '../Icons';

const Touchable =
  Platform.OS === 'android' && Platform.Version >= 21
    ? TouchableDebounce
    : TouchableNativeFeedback;

function MenuItem({
  children,
  disabled,
  disabledTextColor,
  ellipsizeMode,
  onPress,
  style,
  textStyle,
  icon,
  ...props
}) {
  const touchableProps =
    Platform.OS === 'android' && Platform.Version >= 21
      ? {background: TouchableNativeFeedback.SelectableBackground()}
      : {};

  return (
    <Touchable
      disabled={disabled}
      onPress={onPress}
      {...touchableProps}
      {...props}>
      <View style={[styles.container, style]}>
        <Icon source={icon} />
        <TextView
          ellipsizeMode={ellipsizeMode}
          numberOfLines={1}
          style={[
            styles.title,
            disabled && {color: disabledTextColor},
            textStyle,
          ]}
          keyLang={children}
        />
      </View>
    </Touchable>
  );
}

MenuItem.defaultProps = {
  disabled: false,
  disabledTextColor: '#bdbdbd',
  ellipsizeMode: Platform.OS === 'ios' ? 'clip' : 'tail',
  underlayColor: '#e0e0e0',
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    maxWidth: 248,
    minWidth: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '400',
    paddingLeft: 10,
    textAlign: 'left',
  },
});

export default MenuItem;

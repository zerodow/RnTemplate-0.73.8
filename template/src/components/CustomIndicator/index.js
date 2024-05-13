import {View, Text, ActivityIndicator} from 'react-native';
import React, {useMemo} from 'react';
import {AppColors, EMPTY_HEIGHT} from 'src/utilities/constants';

const CustomIndicator = ({
  style = {},
  isEmpty = false,
  isLarge = false,
  color = AppColors.green,
}) => {
  const mergeStyle = useMemo(() => {
    return Object.assign(style, isEmpty ? {height: EMPTY_HEIGHT} : {});
  }, [style, isEmpty]);

  return (
    <ActivityIndicator
      size={isLarge ? 'large' : 'small'}
      color={color}
      style={mergeStyle}
    />
  );
};

export default CustomIndicator;

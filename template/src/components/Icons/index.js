import React from 'react';
import {Image} from 'react-native';
import {AppColors} from '../../utilities/constants';
import TouchableDebounce from '../../components/TouchableDebounce';

const Icon = ({
  width = 24,
  height = 24,
  color = AppColors.icon, // update 'fill' field in svg file to 'currentColor' to get effect
  style,
  source,
  size = 24,
  onPress,
  hitSlop,
  isImage = false,
  imgStyle = {},
  ...props
}) => {
  const IconView = source;
  if (!source) {
    return null;
  }
  return (
    <TouchableDebounce
      hitSlop={hitSlop}
      disabled={!onPress}
      onPress={onPress}
      style={style}>
      {isImage ? (
        <Image source={source} style={[{width, height}, imgStyle]} {...props} />
      ) : (
        <IconView
          width={size || width}
          height={size || height}
          style={{color}}
        />
      )}
    </TouchableDebounce>
  );
};
export default Icon;

import {Image} from 'react-native';
import React, {useMemo} from 'react';
import FastImage from 'react-native-fast-image';
import {img} from 'src/assets';
import {IMAGE_URL} from 'src/utilities/constants';

const ImageView = ({
  uri = '',
  isCache = false,
  style = {},
  isAvatar = false,
  isIcon = false,
  isRectangle = true,
}) => {
  //thumbnail check
  const thumbnail = useMemo(() => {
    if (isAvatar) {
      return img.user_thumb;
    }
    if (isIcon) {
      return img.icon_thumb;
    }
    if (isRectangle) {
      return img.bg_thumb;
    }
  }, [isAvatar, isRectangle]);

  //show thumbnail if don't have uri
  const source = useMemo(() => {
    if (!uri) {
      return thumbnail;
    }
    return {uri: `${IMAGE_URL}/${uri}`};
  }, [uri, thumbnail]);

  if (isCache) {
    return (
      <FastImage
        style={style}
        source={{
          uri: uri,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  }

  return <Image resizeMode="stretch" source={source} style={style} />;
};

export default ImageView;

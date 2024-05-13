import React, {memo, useRef} from 'react';
import {Image} from 'react-native';
import {hitSlop} from 'src/utilities/helper/functional';
import TouchableDebounce from 'src/components/TouchableDebounce';
import ImageUpload from 'src/components/ImageUpload';
import {imageLibSchema} from 'src/api/schema/otherSchema';
import {img} from 'src/assets';

const UploadAvatar = ({
  uri,
  imgStyle,
  isEmpty = false,
  onSuccess = () => {},
}) => {
  const ref = useRef({
    imageUpload: null,
  }).current;

  const _handleImage = data => {
    if (!data.uri) {
      return;
    }
    const params = imageLibSchema({
      uri: data.uri,
      type: data.type,
    });

    onSuccess(params);
  };

  const openSelection = () => {
    ref.imageUpload?.start();
  };

  return (
    <TouchableDebounce onPress={openSelection} hitSlop={hitSlop(10)}>
      <Image source={isEmpty ? img.user_thumb : {uri: uri}} style={imgStyle} />
      <ImageUpload
        ref={r => (ref.imageUpload = r)}
        handleImage={_handleImage}
      />
    </TouchableDebounce>
  );
};

export default memo(UploadAvatar);

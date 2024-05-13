import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {deviceWidth} from 'src/utilities/layout';

const CustomImage = ({src, notUseMainWidth}) => {
  const [mainHeight, setMainHeight] = useState(0);

  const [mainWidth, setMainWidth] = useState(deviceWidth - 30);

  useEffect(() => {
    Image.getSize(
      src,
      (width, height) => {
        if (notUseMainWidth) {
          setMainHeight(height);
          setMainWidth(width);
          return;
        }

        let newMainHeight = (mainWidth * height) / width;
        setMainHeight(newMainHeight);
      },
      error => {
        console.log('error getSize', error);
      },
    );
  }, []);

  if (mainHeight === 0) {
    return null;
  }

  return (
    <Image
      source={{uri: src}}
      style={{
        width: mainWidth,
        height: mainHeight,
      }}
      resizeMode="contain"
    />
  );
};

export default CustomImage;

import {ImageBackground, StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {img} from 'src/assets';
import {
  bgHeaderFullHeight,
  bgHeaderSmallHeight,
  deviceWidth,
} from 'src/utilities/layout';
import {calHeaderHeight} from 'src/utilities/helper/functional';

const SafeViewWithBg = ({
  children,
  customHeader = () => {},
  containerStyle,
  largeBackground = false,
}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const styles = makeStyles(colors, insets);

  const imgConfig = useMemo(() => {
    const {source, height} = calHeaderHeight(insets.top, largeBackground);
    return {
      source,
      height,
    };
  }, [largeBackground, insets]);

  return (
    <View style={[styles.container, containerStyle]}>
      <ImageBackground
        source={imgConfig.source}
        style={[styles.bgContainer, {height: imgConfig.height}]}>
        {customHeader()}
      </ImageBackground>
      {children}
    </View>
  );
};

export default SafeViewWithBg;

const makeStyles = (colors, insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    bgContainer: {
      width: deviceWidth,
    },
  });

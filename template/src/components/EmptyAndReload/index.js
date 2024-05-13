import {StyleSheet} from 'react-native';
import React from 'react';
import Icon from '../Icons';
import {img} from 'src/assets';
import TouchableDebounce from '../TouchableDebounce';
import TextView from '../TextView';
import {useTheme} from '@react-navigation/native';
import {AppFont, EMPTY_HEIGHT} from 'src/utilities/constants';

const EmptyAndReload = ({title = '', onCallback = () => {}}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  return (
    <TouchableDebounce style={styles.container} onPress={() => onCallback()}>
      <Icon isImage source={img.reload} imgStyle={styles.icon} />
      <TextView keyLang={title} style={styles.titleStyle} />
    </TouchableDebounce>
  );
};

export default EmptyAndReload;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: EMPTY_HEIGHT,
    },
    icon: {
      width: 30,
      height: 30,
      alignSelf: 'center',
      marginVertical: 10,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s15,
      color: colors.neutral1,
      alignSelf: 'center',
      textAlign: 'center',
    },
  });

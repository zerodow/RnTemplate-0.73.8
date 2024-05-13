import {StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {
  AppFont,
  AppStyles,
  FORMAT_TIME_NEWS_LETTER,
} from 'src/utilities/constants';
import TextView from 'src/components/TextView';
import TouchableDebounce from 'src/components/TouchableDebounce';
import moment from 'moment';
import ImageView from 'src/components/ImageView';
import {deviceWidth} from 'src/utilities/layout';

const ItemNewsLetter = ({item, index, onGoDetail = () => {}}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const goDetail = () => {
    onGoDetail(item);
  };

  return (
    <TouchableDebounce
      style={[styles.container, AppStyles.shadow2]}
      onPress={goDetail}>
      <TextView style={styles.time}>
        {moment(item.CreatedAt).format(FORMAT_TIME_NEWS_LETTER)}
      </TextView>
      <ImageView style={styles.imgStyle} uri={item?.Image} />
      <TextView
        numberOfLines={2}
        style={[
          styles.content,
          {color: index % 2 === 0 ? colors.neutral3 : colors.neutral4},
        ]}>
        {item.Title}
      </TextView>
    </TouchableDebounce>
  );
};

export default ItemNewsLetter;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      marginHorizontal: 15,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    time: {
      textAlign: 'left',
      fontSize: AppFont.fontSize.s13,
      marginBottom: 10,
    },
    content: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
      marginTop: 5,
    },
    imgStyle: {
      width: deviceWidth - 50,
      height: (deviceWidth - 50) / 2,
      borderRadius: 7,
      marginBottom: 10,
    },
  });

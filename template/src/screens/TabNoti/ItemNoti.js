import {View, StyleSheet} from 'react-native';
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

const ItemNoti = ({item, index, onGoDetail = () => {}}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const goDetail = () => {
    onGoDetail(item);
  };

  return (
    <TouchableDebounce
      style={[styles.container, AppStyles.shadow2]}
      onPress={goDetail}>
      <View style={styles.row}>
        <View style={[styles.circle, {backgroundColor: colors.activeTab}]} />
        <TextView style={styles.time}>
          {moment(item.CreatedDate).format(FORMAT_TIME_NEWS_LETTER)}
        </TextView>
      </View>
      <TextView
        style={[
          styles.content,
          {
            color: item.IsRead
              ? //  index % 2 === 0
                colors.neutral4
              : colors.neutral3,
          },
        ]}>
        {item.Title}
      </TextView>
    </TouchableDebounce>
  );
};

export default ItemNoti;

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
    circle: {
      width: 14,
      height: 14,
      borderRadius: 7,
      marginRight: 10,
    },
    time: {},
    content: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
      marginTop: 5,
    },
  });

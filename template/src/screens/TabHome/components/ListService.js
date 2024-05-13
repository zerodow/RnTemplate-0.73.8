import {View, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {AppFont} from 'src/utilities/constants';
import TextView from 'src/components/TextView';
import {deviceWidth} from 'src/utilities/layout';
import TouchableDebounce from 'src/components/TouchableDebounce';
import Swiper from 'src/components/Swiper';
import ImageView from 'src/components/ImageView';

const ITEM_WIDTH = deviceWidth - 30;

const ListService = ({listServices}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const renderItem = ({item, index}) => {
    return (
      <TouchableDebounce key={index}>
        <ImageView
          uri={item.Icon}
          style={{
            width: ITEM_WIDTH,
            height: ITEM_WIDTH / 1.2,
          }}
        />
      </TouchableDebounce>
    );
  };
  console.log('listServices', listServices);
  if (!listServices || listServices?.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TextView keyLang="service" style={styles.titleStyle} />
      <Swiper
        scrollViewStyle={{width: deviceWidth - 40}}
        bounces={false}
        itemWidth={ITEM_WIDTH}
        style={styles.wrapper}
        loop={false}
        showsPagination={false}
        autoplay={false}>
        {listServices.map((item, index) => renderItem({item, index}))}
      </Swiper>
    </View>
  );
};

export default ListService;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      marginTop: 15,
      backgroundColor: 'white',
      paddingHorizontal: 15,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s20,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary1,
      marginBottom: 15,
    },
    space: {
      height: 20,
    },
    wrapper: {
      height: ITEM_WIDTH / 1.2 + 10,
    },
  });

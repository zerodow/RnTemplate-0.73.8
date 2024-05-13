import {View, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {AppFont, AppStyles} from 'src/utilities/constants';
import TextView from 'src/components/TextView';
import TouchableDebounce from 'src/components/TouchableDebounce';
import ImageView from 'src/components/ImageView';
import {deviceWidth} from 'src/utilities/layout';

const ListExtension = ({listExtensions}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const onPressFunc = item => {
    alert(item.Code);
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableDebounce
        key={index}
        style={styles.buttonWrapper}
        onPress={() => onPressFunc(item)}>
        <View style={styles.wrapper}>
          <ImageView isIcon uri={item.Icon} style={styles.imgView} />
        </View>
        <TextView style={styles.v1}>{item.Name}</TextView>
      </TouchableDebounce>
    );
  };

  if (!listExtensions || listExtensions?.length === 0) {
    return;
  }

  return (
    <View style={styles.container}>
      <TextView keyLang="extension" style={styles.titleStyle} />
      <FlatList
        data={listExtensions}
        horizontal={true}
        keyExtractor={(item, index) => index + ''}
        showsHorizontalScrollIndicator={false}
        renderItem={_renderItem}
        bounces={false}
      />
    </View>
  );
};

export default ListExtension;

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
    buttonWrapper: {
      marginRight: 20,
      paddingTop: 10,
      width: (deviceWidth - 30) / 5,
    },
    wrapper: {
      padding: 8,
      borderRadius: 10,
      backgroundColor: 'white',
      ...AppStyles.shadow3,
    },
    v1: {
      marginTop: 10,
      fontSize: AppFont.fontSize.s13,
      fontWeight: AppFont.fontWeight.bold,
      color: colors.primary1,
      textAlign: 'center',
    },
    space: {
      height: 20,
    },
    imgView: {
      width: (deviceWidth - 30) / 5 - 16,
      height: (deviceWidth - 30) / 5 - 16,
    },
  });

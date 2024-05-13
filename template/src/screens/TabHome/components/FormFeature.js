import {View, StyleSheet, ImageBackground, FlatList} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {deviceWidth} from 'src/utilities/layout';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import TextView from 'src/components/TextView';
import {AppFont, BLOCK_CODE} from 'src/utilities/constants';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {img} from 'src/assets';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';

const FormFeature = ({listFunctions}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const goBill = () => {
    alert('goBill');
  };

  const goReport = () => {
    navigate(RouteName.TAB_REPORT);
  };

  const _renderItem = ({item, index}) => {
    switch (item.Code) {
      case BLOCK_CODE.PA:
        return (
          <TouchableDebounce style={styles.wrapper} onPress={goReport}>
            <ImageBackground
              resizeMode="cover"
              source={img.report}
              style={styles.v1}>
              <Icon source={IconSVG.report2} size={40} />
              <TextView keyLang="report" style={styles.txt} />
            </ImageBackground>
          </TouchableDebounce>
        );
      case BLOCK_CODE.HD:
        return (
          <TouchableDebounce style={styles.wrapper} onPress={goBill}>
            <ImageBackground
              resizeMode="cover"
              source={img.bill}
              style={styles.v1}>
              <Icon source={IconSVG.bill} size={40} />
              <TextView keyLang="bill" style={styles.txt} />
            </ImageBackground>
          </TouchableDebounce>
        );
      default:
        return (
          <TouchableDebounce style={styles.wrapper} onPress={goBill}>
            <ImageBackground
              resizeMode="cover"
              source={img.bill}
              style={styles.v1}>
              <Icon source={IconSVG.bill} size={40} />
              <TextView keyLang="bill" style={styles.txt} />
            </ImageBackground>
          </TouchableDebounce>
        );
    }
  };

  if (!listFunctions || listFunctions?.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listFunctions}
        keyExtractor={(item, index) => index + ''}
        renderItem={_renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      />
    </View>
  );
};

export default FormFeature;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      paddingLeft: 15,
      flexDirection: 'row',
      marginTop: 15,
    },
    v1: {
      width: (deviceWidth - 40) / 2,
      height: 80,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    v2: {
      width: deviceWidth - 30,
      height: 80,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    space: {
      width: 10,
    },
    txt: {
      fontSize: AppFont.fontSize.s18,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.white,
    },
    wrapper: {
      marginRight: 10,
    },
  });

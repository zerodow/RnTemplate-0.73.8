import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import Icon from 'src/components/Icons';
import TextView from 'src/components/TextView';
import {APP_LANGUAGE, AppFont} from 'src/utilities/constants';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {navigate} from 'src/utilities/helper/navigationHelper';
import {useSelector} from 'react-redux';
import {FEATURE_CONST} from '../FeatureConfig';

const ItemFeature = ({
  item,
  index,
  onLogout = () => {},
  onDeleteAcc = () => {},
}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const styles = makeStyles(colors, insets);

  const language = useSelector(state => state.AppReducer.language);

  const handlePress = () => {
    if (item.title === FEATURE_CONST.LOGOUT) {
      return onLogout();
    }
    if (item.title === FEATURE_CONST.DELETE_ACC) {
      return onDeleteAcc();
    }

    return navigate(item.destination);
  };

  const renderSubValue = () => {
    if (item.title === FEATURE_CONST.CHANGE_LANG) {
      return (
        <View style={{paddingHorizontal: 20, paddingBottom: 12}}>
          <TextView>
            {language === APP_LANGUAGE.VI ? 'Tiếng Việt' : 'English'}
          </TextView>
        </View>
      );
    }

    if (item.title === FEATURE_CONST.APART_MANAGER) {
      return (
        <View style={{paddingHorizontal: 20, paddingBottom: 12}}>
          <TextView keyLang="houseHold" />
        </View>
      );
    }
    return null;
  };

  return (
    <TouchableDebounce style={styles.container} onPress={handlePress}>
      <View style={styles.row}>
        <TextView keyLang={item.title} style={styles.titleStyle} />
        <Icon source={item.icon} size={24} />
      </View>
      {renderSubValue()}
      <View style={styles.line} />
    </TouchableDebounce>
  );
};

export default ItemFeature;

const makeStyles = (colors, insets) =>
  StyleSheet.create({
    container: {},
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 11,
    },
    line: {
      backgroundColor: colors.borderLine,
      height: 1,
      width: '100%',
    },
    titleStyle: {
      color: colors.neutral3,
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.regular,
    },
  });

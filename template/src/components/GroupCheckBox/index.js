import React, {useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useController} from 'react-hook-form';
import {AppFont} from 'src/utilities/constants';
import {useTheme} from '@react-navigation/native';
import Icon from '../Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import TextView from '../TextView';

const GroupCheckBox = props => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {
    title,
    data = [],
    style = {},
    control,
    defaultValue,
    name,
    titleStyle,
  } = props;
  const {field = null} = useController({
    control: control ?? control,
    defaultValue: defaultValue ?? '',
    name: name,
    shouldUnregister: true,
  });

  const handleCheck = item => {
    if (field?.value?.code === item?.code) return;
    const result = data.filter(ele => ele?.code === item?.code);
    field.onChange(result[0]);
  };

  return (
    <View style={style}>
      <View style={styles.wrapContainer}>
        <TextView style={[styles.title, titleStyle]} keyLang={title} />
        <View style={styles.itemCheckBox}>
          {data.map(item => (
            <CheckBox
              item={item}
              key={item.code}
              onCheck={handleCheck}
              selectedValue={field?.value}
              styles={styles}
              {...props}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const CheckBox = props => {
  const {onCheck, selectedValue = {}, item, optionsStyle, styles} = props;
  return (
    <View style={styles.checkContainer}>
      <TouchableOpacity onPress={() => onCheck && onCheck(item)}>
        <Icon
          source={
            item?.code === selectedValue?.code ? IconSVG.check : IconSVG.uncheck
          }
          size={25}
        />
      </TouchableOpacity>
      <TextView
        style={[styles.options, optionsStyle]}
        keyLang={item.description}
      />
    </View>
  );
};

export default GroupCheckBox;

const makeStyles = colors =>
  StyleSheet.create({
    title: {
      fontSize: AppFont.fontSize.s16,
      color: colors.neutral3,
      fontWeight: AppFont.fontWeight.regular,
    },
    options: {marginLeft: 10, fontSize: AppFont.fontSize.s13},
    checkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 30,
    },
    itemCheckBox: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: 30,
      justifyContent: 'space-around',
    },
    wrapContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });

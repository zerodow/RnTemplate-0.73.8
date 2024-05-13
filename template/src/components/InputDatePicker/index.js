import React from 'react';
import {memo, useRef, useMemo} from 'react';
import moment from 'moment';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useController, useForm} from 'react-hook-form';
import {useTheme} from '@react-navigation/native';
import TextView from '../TextView';
import Icon from '../Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import DatePickerPopup from '../DatePickerPopup';
import {AppColors, AppFont, AppStyles} from 'src/utilities/constants';
import {inputHeight} from 'src/utilities/layout';
import {t} from 'i18next';

const InputDatePicker = (props, _ref) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const {
    label = '',
    placeholder = null,
    errorMessage = null,
    containerStyle = {},
    labelStyle = {},
    labelTextStyle = {},
    inputWrapperStyle = {},
  } = props;
  const ref = useRef({DatePickerPopup: null}).current;

  const DATE_FORMAT = 'DD/MM/YYYY';

  const {control} = useForm();

  const {field = null} = useController({
    control: props.control ?? control,
    defaultValue: props.defaultValue ?? null,
    name: props.name,
    rules: props.rules ?? {},
  });

  const _handlePressPicker = async () => {
    Keyboard.dismiss();
    await ref.DatePickerPopup.show(
      field?.value ? moment(field?.value, DATE_FORMAT).toDate() : null,
      _handlePickStartDateDone,
    );
  };

  const _handlePickStartDateDone = async _date => {
    field.onChange(moment(_date).format(DATE_FORMAT));
    await ref.DatePickerPopup.dismiss();
  };

  const _clear = () => {
    field.onChange(null);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.labelWrapper, labelStyle]}>
        <TextView keyLang={label} style={[styles.label, labelTextStyle]} />
      </View>
      <View style={[styles.inputWrapper, AppStyles.shadow2, inputWrapperStyle]}>
        <TouchableOpacity
          style={styles.wrapTextInput}
          onPress={_handlePressPicker}
          hitSlop={{top: 10, bottom: 10}}>
          <TextView
            fontSize={AppFont.fontSize.s13}
            style={[styles.textInput, !field?.value && styles.textPlaceholder]}>
            {field?.value ?? t(placeholder)}
          </TextView>
        </TouchableOpacity>
        {field?.value ? (
          <TouchableOpacity style={styles.wrapIcon} onPress={_clear}>
            <Icon source={IconSVG.close} size={20} color="#999" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.wrapIcon}
            onPress={_handlePressPicker}>
            <Icon source={IconSVG.calendar_icon} size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <TextView keyLang={errorMessage} style={styles.errorText} />
      ) : (
        <View style={{height: 15}} />
      )}
      <DatePickerPopup
        ref={node => {
          ref.DatePickerPopup = node;
        }}
      />
    </View>
  );
};

export default memo(InputDatePicker);

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      // marginHorizontal: 10,
    },
    wrapTextInput: {
      height: '100%',
      justifyContent: 'center',
    },
    floatIcon: {
      position: 'absolute',
      right: 8,
      height: inputHeight,
      width: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: AppFont.fontSize.s14,
      color: colors.neutral3,
    },
    labelWrapper: {},
    inputWrapper: {
      height: inputHeight,
      marginTop: 8,
      borderColor: colors.borderInput,
      borderWidth: 1,
      borderRadius: 20,
      zIndex: 1,
      paddingHorizontal: 16,
      backgroundColor: 'white',
    },
    inputStyle: {
      flex: 1,
      alignItems: 'center',
    },
    inputMultiline: {},
    errorText: {
      color: AppColors.red,
      marginTop: 6,
      fontSize: AppFont.fontSize.s12,
    },
    textInput: {
      color: colors.neutral1,
      fontWeight: AppFont.fontWeight.regular,
    },
    textPlaceholder: {
      color: colors.placeholder,
    },
    wrapIcon: {
      position: 'absolute',
      top: 0,
      right: 5,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      zIndex: 10,
    },
  });

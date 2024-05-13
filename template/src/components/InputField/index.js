import {View, StyleSheet, TextInput} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import TextView from '../TextView';
import {useController, useForm} from 'react-hook-form';
import {AppColors, AppFont, AppStyles} from '../../utilities/constants';
import {inputHeight} from '../../utilities/layout';
import {useTranslation} from 'react-i18next';
import Icon from '../Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import TouchableDebounce from '../TouchableDebounce';

const InputField = props => {
  const {
    //style props
    containerStyle,
    label,
    labelStyle,
    labelTextStyle,
    inputWrapperStyle,
    inputStyle,
    //hook form props
    errorMessage,
    defaultValue,
    name,
    rules,
    shouldUnregister,
    //input props
    editable = true,
    multiline = false,
    onBlurHandle = () => {},
    onFocusHandle = () => {},
    placeholder,
    isPassword = false,
    maxLength = 30,
  } = props;
  const {t} = useTranslation();
  const [focused, setFocused] = useState(false);
  const [isSecure, setSecure] = useState(isPassword);

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {control} = useForm();

  const {field = null} = useController({
    control: props.control ?? control,
    defaultValue: defaultValue ?? '',
    name: name,
    rules: rules ?? {},
    shouldUnregister: shouldUnregister,
  });

  const _handleBlur = () => {
    //trường hợp để nhiều space ở cuối và string dài, thì sẽ ko target được vào space
    //trim value khi blur
    field.onChange(field.value?.trim());
    setFocused(false);
    field.onBlur();
    onBlurHandle && onBlurHandle();
  };

  const _handleFocused = () => {
    setFocused(true);
    onFocusHandle();
  };

  const _onChangeText = useCallback(
    txt => {
      field?.onChange(txt);
    },
    [field],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.labelWrapper, labelStyle]}>
        <TextView keyLang={label} style={[styles.label, labelTextStyle]} />
      </View>
      <View style={[styles.inputWrapper, inputWrapperStyle]}>
        <TextInput
          {...props}
          editable={!!editable}
          style={[
            editable ? styles.inputStyle : styles.inputDisable,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          value={field?.value}
          secureTextEntry={isSecure}
          onFocus={_handleFocused}
          onBlur={_handleBlur}
          onChangeText={_onChangeText}
          textAlignVertical="center"
          placeholderTextColor={colors.placeholder}
          placeholder={t(placeholder)}
          maxLength={maxLength}
        />
        {isPassword && (
          <TouchableDebounce
            style={styles.floatIcon}
            onPress={() => setSecure(!isSecure)}>
            <Icon
              source={isSecure ? IconSVG.visible : IconSVG.unvisible}
              size={22}
            />
          </TouchableDebounce>
        )}
      </View>
      {errorMessage ? (
        <TextView keyLang={errorMessage} style={styles.errorText} />
      ) : (
        <View style={{height: 15}} />
      )}
    </View>
  );
};

export default InputField;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      // marginHorizontal: 10,
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
      fontWeight: AppFont.fontWeight.regular,
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
      ...AppStyles.shadow2,
    },
    inputStyle: {
      flex: 1,
      alignItems: 'center',
      color: colors.neutral1,
      fontWeight: AppFont.fontWeight.regular,
    },
    inputDisable: {
      flex: 1,
      alignItems: 'center',
      color: colors.borderInput,
      fontWeight: AppFont.fontWeight.bold,
    },
    inputMultiline: {},
    errorText: {
      color: AppColors.red,
      marginTop: 6,
      fontSize: AppFont.fontSize.s12,
    },
  });

import {View, Text, StyleSheet, TextInput, Keyboard} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import Icon from '../Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import {AppFont} from 'src/utilities/constants';
import {useTranslation} from 'react-i18next';

const SearchBar = ({onSearch = () => {}}, _ref) => {
  useImperativeHandle(_ref, () => ({onClear}));
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const {t} = useTranslation();
  const [text, setText] = useState('');

  const _onChangeText = txt => {
    setText(txt);
  };

  const onClear = () => {
    setText('');
    Keyboard.dismiss();
  };

  const _onSubmit = ({nativeEvent}) => {
    onSearch(nativeEvent.text);
  };

  return (
    <View style={styles.container}>
      <Icon source={IconSVG.search} size={22} />
      <TextInput
        value={text}
        onChangeText={_onChangeText}
        style={styles.inputStyle}
        placeholder={t('search')}
        placeholderTextColor={colors.neutral4}
        returnKeyType={'search'}
        onSubmitEditing={_onSubmit}
      />
      {text && <Icon source={IconSVG.close} size={15} onPress={onClear} />}
    </View>
  );
};

export default forwardRef(SearchBar);

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      marginHorizontal: 15,
      backgroundColor: colors.neutral7,
      borderRadius: 6,
      flexDirection: 'row',
      height: 40,
      paddingHorizontal: 10,
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 10,
    },
    inputStyle: {
      flex: 1,
      fontSize: AppFont.fontSize.s14,
      fontWeight: AppFont.fontWeight.regular,
      marginHorizontal: 10,
    },
  });

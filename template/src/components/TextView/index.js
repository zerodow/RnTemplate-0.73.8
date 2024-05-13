import React, {forwardRef, memo, useMemo} from 'react';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';
import {AppColors, AppFont} from '../../utilities/constants';
import {useTranslation} from 'react-i18next';

const TextView = (
  props = {
    style: {},
    numberOfLines: Number,
    fontSize: Number,
    color: '',
    keyLang: '',
    prefix: '',
    suffix: '',
    keyLangPrefix: '',
    keyLangSuffix: '',
    // fontFamily: '',
  },
  ref,
) => {
  const {t} = useTranslation();
  const {
    fontSize = AppFont.fontSize.s13,
    color = AppColors.textPrimary,
    keyLang,
    keyLangPrefix,
    keyLangSuffix,
    prefix,
    suffix,
    // fontFamily = AppFont.fontFamily.regular,
  } = props;

  const language = useSelector(state => state.AppReducer.language);

  const content = useMemo(() => {
    const val = [];
    const option = {locale: language};
    if (prefix) val.push(prefix);
    else if (keyLangPrefix) {
      val.push(t(keyLangPrefix, option));
    }
    if (keyLang) {
      val.push(t(keyLang, option));
    }
    if (suffix) val.push(suffix);
    else if (keyLangSuffix) {
      val.push(t(keyLangSuffix, option));
    }
    return val;
  }, [keyLang, prefix, suffix, language, keyLangPrefix, keyLangSuffix]);

  return (
    <Text
      ref={ref}
      {...props}
      style={[
        {
          // fontFamily,
          fontSize,
          fontWeight: AppFont.fontWeight.regular,
          color,
        },
        props.style,
      ]}>
      {!!content.length ? content : props.children || null}
    </Text>
  );
};

export default memo(forwardRef(TextView));

import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTheme} from '@react-navigation/native';
import {AppColors} from '../../utilities/constants';

const LoadingContainer = (props, _ref) => {
  useImperativeHandle(_ref, () => ({show, dismiss}));

  const ref = useRef({
    resolve: null,
  }).current;

  const [visible, setVisible] = useState(false);

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const show = _data => {
    return new Promise(resv => {
      ref.resolve = resv;
      setVisible(true);
    });
  };

  const dismiss = () => {
    return new Promise(resv => {
      setVisible(false);
      ref.resolve = resv;
    });
  };

  if (!visible) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={AppColors.white} />
    </View>
  );
};

export default memo(forwardRef(LoadingContainer));

const makeStyles = colors => {
  return StyleSheet.create({
    container: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    txt: {
      color: AppColors.white,
      fontSize: 20,
      marginTop: 20,
    },
  });
};

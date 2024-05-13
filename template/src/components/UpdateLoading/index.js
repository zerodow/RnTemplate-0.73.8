import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTheme} from '@react-navigation/native';
import {AppColors, AppFont} from '../../utilities/constants';
import TextView from '../TextView';

const UpdateLoading = (props, _ref) => {
  useImperativeHandle(_ref, () => ({show, dismiss}));

  const ref = useRef({
    resolve: null,
  }).current;

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    if (visible) {
      return animate();
    }
    setProgress(0);
  }, [visible]);

  const animate = () => {
    let count = 0;
    setTimeout(() => {
      this.counting = setInterval(() => {
        count += 1;
        if (count === 100) {
          clearInterval(this.counting);
          setVisible(false);
        }
        setProgress(count);
      }, 100);
    }, 1500);
  };

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
      <TextView style={styles.txt}>{`Updating (${progress}/100%)`}</TextView>
    </View>
  );
};

export default memo(forwardRef(UpdateLoading));

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
      fontSize: AppFont.fontSize.s20,
      marginTop: 20,
      fontWeight: AppFont.fontWeight.bold,
    },
  });
};

import {useTheme} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import TextView from 'src/components/TextView';
import {AppFont} from 'src/utilities/constants';

const Timer = ({initialValue}) => {
  const {colors} = useTheme();
  const genTimeString = val => {
    return `0${(val - (val % 60)) / 60}:${val % 60 == 0 ? '00' : val % 60}`;
  };

  const [time, setTime] = useState(initialValue || 180);
  const timerRef = useRef(time);

  useEffect(() => {
    const timerId = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        clearInterval(timerId);
      } else {
        setTime(timerRef.current);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <TextView style={[styles.container, {color: colors.primary05}]}>
      {genTimeString(time)}
    </TextView>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    fontSize: AppFont.fontSize.s16,
    fontWeight: AppFont.fontWeight.bold,
  },
});

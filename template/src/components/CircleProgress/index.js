import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import TextView from '../TextView';
import {StyleSheet, View} from 'react-native';
import {AppFont} from 'src/utilities/constants';

const CircleProgress = ({initialValue = 60, onDone = () => {}}, _ref) => {
  useImperativeHandle(_ref, () => ({start, stop}));

  const [time, setTime] = useState(initialValue);
  const [isDone, setDone] = useState(false);

  useEffect(() => {
    if (isDone) {
      onDone();
    }
  }, [isDone, onDone]);

  const ref = useRef({
    circularProgress: null,
    timerRef: time,
    timerId: null,
  }).current;

  const start = () => {
    setDone(false);
    ref.timerId = setInterval(() => {
      ref.timerRef -= 1;
      if (ref.timerRef < 0) {
        stop();
      } else {
        setTime(ref.timerRef);
      }
    }, 1000);
  };

  const stop = () => {
    clearInterval(ref.timerId);
    setTime(initialValue);
    ref.timerRef = initialValue;
    setDone(true);
  };

  if (isDone) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        ref={r => (ref.circularProgress = r)}
        rotation={0}
        size={40}
        width={3}
        fill={((initialValue - time) / initialValue) * 100}
        tintColor="#C1C7CD"
        backgroundColor="#34A853">
        {() => <TextView style={styles.timeStyle}>{time}</TextView>}
      </AnimatedCircularProgress>
      <TextView keyLang="second" style={{marginLeft: 7}} />
    </View>
  );
};

export default memo(forwardRef(CircleProgress));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeStyle: {
    fontSize: AppFont.fontSize.s16,
    fontWeight: AppFont.fontWeight.bold,
    color: '#2D4CAF',
  },
});

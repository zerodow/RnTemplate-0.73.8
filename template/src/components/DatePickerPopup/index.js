import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  memo,
} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {AppColors, AppFont} from 'src/utilities/constants';
import TextView from '../TextView';

const DateTimePickerPopup = (props, _ref) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  useImperativeHandle(_ref, () => ({show, dismiss}));
  const ref = useRef({resolve: null, onDone: () => null}).current;
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('date');
  const insets = useSafeAreaInsets();

  const show = (_date, _onDone = () => {}) => {
    return new Promise(resv => {
      ref.resolve = resv;
      setVisible(true);
      setType('date');
      if (_date) {
        setDate(_date);
      } else {
        setDate(new Date());
      }
      ref.onDone = _onDone;
    });
  };

  const dismiss = () => {
    return new Promise(resv => {
      setVisible(false);
      ref.resolve = resv;
    });
  };

  const _onShow = () => {
    if (ref.resolve !== null) {
      ref.resolve();
      ref.resolve = null;
    }
  };

  const _onDismiss = () => {
    if (ref.resolve !== null) {
      ref.resolve();
      ref.resolve = null;
    }
  };

  const _handleChangeDate = _date => {
    setDate(_date);
  };

  const _handlePressNext = () => {
    if (props.type === 'datetime') {
      setType('time');
    } else {
      ref.onDone(date);
    }
  };

  const _handlePressBack = () => {
    if (props.type === 'datetime') {
      setType('date');
    } else {
      dismiss();
    }
  };

  return (
    <Modal
      isVisible={visible}
      onModalHide={_onDismiss}
      onModalShow={_onShow}
      backdropOpacity={0.4}
      useNativeDriver
      onBackdropPress={dismiss}
      style={styles.container}
      hideModalContentWhileAnimating
      statusBarTranslucent>
      <View style={[styles.modalContent, {paddingBottom: insets.bottom}]}>
        <View style={styles.wrapHeader}>
          <TouchableOpacity
            onPress={_handlePressBack}
            hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
            <TextView style={styles.textCancel} bold>
              {props.type === 'datetime' && type === 'date'
                ? 'Quay lại'
                : 'Hủy'}
            </TextView>
          </TouchableOpacity>
          <TextView style={styles.headerTitle}>
            {moment(date).format(
              props.type === 'datetime' ? 'DD/MM/YYYY hh:mm' : 'DD/MM/YYYY',
            )}
          </TextView>
          <TouchableOpacity
            hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
            onPress={_handlePressNext}>
            <TextView style={styles.textDone} bold>
              {props.type === 'datetime' ? 'Chọn giờ' : 'Xong'}
            </TextView>
          </TouchableOpacity>
        </View>
        <DatePicker
          date={date}
          onDateChange={_handleChangeDate}
          mode={type}
          locale="vi_VN"
          textColor={colors.neutral1}
        />
      </View>
    </Modal>
  );
};

export default memo(forwardRef(DateTimePickerPopup));

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      margin: 0,
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContent: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: AppColors.white,
      borderTopEndRadius: 15,
      borderTopStartRadius: 15,
    },
    wrapHeader: {
      paddingVertical: 15,
      flexDirection: 'row',
      paddingHorizontal: 16,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: AppFont.fontSize.s16,
      fontWeight: '500',
    },
    textCancel: {
      fontSize: 18,
      color: colors.primary1,
      fontWeight: 'bold',
    },
    textDone: {
      fontSize: 18,
      color: colors.primary1,
      fontWeight: 'bold',
    },
    wrapLabel: {
      flexDirection: 'row',
    },
    textLabel: {
      paddingHorizontal: 15,
    },
  });

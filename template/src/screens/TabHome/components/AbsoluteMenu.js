import {View, StyleSheet, FlatList} from 'react-native';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {AppColors, AppFont} from 'src/utilities/constants';
import {deviceWidth} from 'src/utilities/layout';
import TextView from 'src/components/TextView';
import {callFunc} from 'src/utilities/helper/functional';

const AbsoluteMenu = (props, _ref) => {
  useImperativeHandle(_ref, () => ({show, dismiss}));

  const ref = useRef({
    resolve: null,
  }).current;

  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [listContact, setList] = useState([1, 2, 3, 4]);

  const show = ({layout, data}) => {
    return new Promise(resv => {
      setLocation({x: layout.x, y: layout.y});
      ref.resolve = resv;
      setVisible(true);
      setList(data);
    });
  };

  const dismiss = () => {
    return new Promise(resv => {
      setVisible(false);
      ref.resolve = resv;
    });
  };

  const makeCall = async phone => {
    console.log('phone', phone);
    // await dismiss(300);
    callFunc(phone);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableDebounce
        style={styles.itemContainer}
        onPress={() => makeCall(item.Phone)}>
        <View style={styles.circle} />
        <View style={styles.itemWrapper}>
          <TextView style={styles.nameStyle}>{item.Name}</TextView>
          <TextView style={styles.phoneStyle}>{item.Phone}</TextView>
        </View>
        <Icon source={IconSVG.call} size={20} onPress={() => alert('a')} />
      </TouchableDebounce>
    );
  };

  if (!visible || !location) {
    return <></>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FlatList
          style={styles.listStyle}
          data={listContact}
          renderItem={renderItem}
          keyExtractor={(item, index) => index + ''}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableDebounce
        style={[
          styles.floatStyle,
          {
            top: location.y + 5,
            left: location.x + 5,
          },
        ]}
        onPress={() => dismiss()}>
        <Icon source={IconSVG.close} color={AppColors.red} size={20} />
      </TouchableDebounce>
    </View>
  );
};

export default memo(forwardRef(AbsoluteMenu));

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  floatStyle: {
    position: 'absolute',
    borderRadius: 20,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: deviceWidth - 120,
    height: 60,
    backgroundColor: AppColors.greenLow,
    borderRadius: 7,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.white,
  },
  nameStyle: {
    fontWeight: AppFont.fontWeight.bold,
    color: AppColors.green,
  },
  phoneStyle: {
    color: AppColors.neutral2,
  },
  listStyle: {
    maxHeight: 300,
    width: deviceWidth - 120,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapper: {
    height: '100%',
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'space-around',
  },
});

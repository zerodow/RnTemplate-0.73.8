import {View, Text, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {useTheme} from '@react-navigation/native';
import {deviceWidth} from 'src/utilities/layout';
import {AppFont, AppStyles} from 'src/utilities/constants';
import TextView from 'src/components/TextView';
import TouchableDebounce from 'src/components/TouchableDebounce';
import QRCode from 'react-native-qrcode-svg';
import ModalQR from './ModalQR';
import {hitSlop} from 'src/utilities/helper/functional';

const ItemApart = ({item, canNotTouch = false, index, goDetail = () => {}}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const ref = useRef({
    modalQR: null,
  }).current;

  const onShowQR = () => {
    ref.modalQR?.show();
  };

  return (
    <TouchableDebounce
      disabled={canNotTouch}
      style={styles.container}
      onPress={() => goDetail(item)}>
      <View style={styles.v1}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Row title={'proj'} content={item.ProjectName} styles={styles} />
          <Row title={'tow'} content={item.TowerName} styles={styles} />
        </View>
        <TouchableDebounce hitSlop={hitSlop(15)} onPress={onShowQR}>
          <QRCode value={item.QrCode} size={35} />
        </TouchableDebounce>
      </View>
      <Row title={'flo'} content={item.FloorName} styles={styles} />
      <Row title={'addr'} content={item.Address} styles={styles} />
      <TextView style={styles.note}>Chi tiết</TextView>
      {item.QrCode && (
        <ModalQR
          qrCode={item.QrCode}
          apartName={''}
          ref={r => (ref.modalQR = r)}
        />
      )}
    </TouchableDebounce>
  );
};

const Row = ({title, content, styles}) => {
  return (
    <View style={styles.rowContainer}>
      <View style={styles.titleView}>
        <TextView numberOfLines={1} style={styles.titleStyle} keyLang={title} />
      </View>
      <TextView numberOfLines={2} style={styles.contentStyle}>
        {content}
      </TextView>
    </View>
  );
};

export default ItemApart;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      alignSelf: 'center',
      backgroundColor: 'white',
      borderRadius: 9,
      width: deviceWidth - 30,
      padding: 8,
      marginTop: 15,
      ...AppStyles.shadow2,
    },
    rowContainer: {
      flexDirection: 'row',
      marginVertical: 8,
    },
    titleView: {
      width: 100,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s15,
      color: colors.neutrual4,
    },
    contentStyle: {
      fontSize: AppFont.fontSize.s15,
      color: colors.neutrual3,
      fontWeight: AppFont.fontWeight.bold,
    },
    v1: {
      flexDirection: 'row',
    },
    note: {
      textAlign: 'right',
      fontSize: AppFont.fontSize.s13,
    },
  });

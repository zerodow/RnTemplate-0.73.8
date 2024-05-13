import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import ItemApart from './ItemApart';
import TextView from 'src/components/TextView';
import {AppFont} from 'src/utilities/constants';
import {getDetailApart} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import EmptyAndReload from 'src/components/EmptyAndReload';

const fake = [
  {name: 'duc le minh', phone: '0878787878'},
  {name: 'duc le minh', phone: '0878787878'},
  {name: 'duc le minh', phone: '0878787878'},
];

const DetailApart = ({route}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {userMapId} = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const {data} = route.params;
  const [list, setList] = useState(null);

  useEffect(() => {
    fetchAPI();
  }, [data]);

  const fetchAPI = async () => {
    const res = await getDetailApart({
      residentId: userMapId,
      apartmentId: data.ApartmentId,
    });

    setList(res || []);
  };

  const onRefresh = () => {
    fetchAPI();
  };

  const renderDefaultRow = () => {
    return (
      <View style={styles.rowContainer}>
        <View style={styles.v1}>
          <TextView keyLang="name" style={styles.nameDefaultStyle} />
        </View>
        <View style={styles.v2}>
          <TextView keyLang="phone2" style={styles.phoneDefaultStyle} />
        </View>
      </View>
    );
  };

  const renderRow = (item, index) => {
    return (
      <View
        key={index}
        style={[styles.rowContainer, {backgroundColor: colors.hightlight}]}>
        <View style={styles.v1}>
          <TextView style={styles.nameStyle}>{item.name}</TextView>
        </View>
        <View style={styles.v2}>
          <TextView style={styles.phoneStyle}>{item.phone}</TextView>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (!list || list.length === 0) {
      let title = !list ? 'errorTitle' : list?.length === 0 ? 'noData' : '';
      return <EmptyAndReload title={title} onCallback={onRefresh} />;
    }
    return (
      <>
        {renderDefaultRow()}
        {list.map((item, index) => renderRow(item, index))}
      </>
    );
  };

  return (
    <SafeViewWithBg customHeader={() => <Header title={'infoApart'} />}>
      <View style={styles.container}>
        <ItemApart item={data} canNotTouch={true} />
        <TextView keyLang="listMem" style={styles.title} />
        {renderContent()}
      </View>
    </SafeViewWithBg>
  );
};

export default DetailApart;

const makeStyles = colors =>
  StyleSheet.create({
    container: {flex: 1},
    title: {
      fontSize: AppFont.fontSize.s18,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary1,
      margin: 15,
    },
    v1: {
      flex: 3,
    },
    v2: {
      flex: 1.5,
    },
    nameDefaultStyle: {
      fontSize: AppFont.fontSize.s15,
      color: colors.neutral3,
      fontWeight: AppFont.fontWeight.bold,
      textAlign: 'left',
    },
    phoneDefaultStyle: {
      fontSize: AppFont.fontSize.s15,
      color: colors.neutral3,
      fontWeight: AppFont.fontWeight.bold,
      textAlign: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    nameStyle: {
      fontSize: AppFont.fontSize.s14,
      color: colors.neutral3,
      textAlign: 'left',
    },
    phoneStyle: {
      fontSize: AppFont.fontSize.s14,
      color: colors.neutral3,
      textAlign: 'center',
    },
  });

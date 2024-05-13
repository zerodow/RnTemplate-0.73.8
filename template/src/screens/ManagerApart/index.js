import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import ItemApart from './ItemApart';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import {getListApart} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import EmptyAndReload from 'src/components/EmptyAndReload';
import CustomIndicator from 'src/components/CustomIndicator';
import {handleAlertError} from 'src/api/axios';
import {delay} from 'src/utilities/helper/functional';

const dataFake = [
  {
    id: 1,
    project: 'GOld Season',
    tower: 'Toa Autumn',
    floor: 'Tang 03',
    address: 'N03.05/Hoàng Văn Dũng',
  },
  {
    id: 2,
    project: 'GOld Season',
    tower: 'Toa Autumn',
    floor: 'Tang 03',
    address: 'N03.05/Hoàng Văn Dũng',
  },
  {
    id: 3,
    project: 'GOld Season',
    tower: 'Toa Autumn',
    floor: 'Tang 03',
    address: 'N03.05/Hoàng Văn Dũng',
  },
];

const ManagerApart = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const userId = useSelector(state => state.AuthReducer.userId);

  const [refreshing, setRefresh] = useState(false);
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    try {
      setLoading(true);
      const res = await getListApart({userId});
      console.log('res', res);

      setList(res || []);
    } catch (error) {
      handleAlertError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefresh(true);
    await delay(500);
    setRefresh(false);
    fetchAPI();
  };

  const _goDetail = item => {
    navigate(RouteName.APART_DETAIL, {
      data: item,
    });
  };

  const _renderItem = ({item, index}) => {
    return <ItemApart item={item} index={index} goDetail={_goDetail} />;
  };

  const renderContent = () => {
    if (loading) {
      return <CustomIndicator isEmpty />;
    }
    if (!list || list?.length === 0) {
      let title = !list ? 'errorTitle' : list?.length === 0 ? 'noData' : '';
      return <EmptyAndReload title={title} onCallback={fetchAPI} />;
    }
    return (
      <FlatList
        data={list}
        keyExtractor={(item, index) => index + ''}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  return (
    <SafeViewWithBg customHeader={() => <Header title={'listApart'} />}>
      <View style={styles.container}>{renderContent()}</View>
    </SafeViewWithBg>
  );
};

export default ManagerApart;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });

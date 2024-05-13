import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import {getNoteBookCategory} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import EmptyAndReload from 'src/components/EmptyAndReload';
import CustomIndicator from 'src/components/CustomIndicator';
import {handleAlertError} from 'src/api/axios';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import ItemView from './ItemView';
import {delay} from 'src/utilities/helper/functional';

const HandList = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {projectId, zoneId, towerId} = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );
  const [refreshing, setRefresh] = useState(false);
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI();
    // _onGoDetail();
  }, []);

  const fetchAPI = async () => {
    try {
      setLoading(true);
      const res = await getNoteBookCategory({
        projectId,
        zoneId,
        towerId,
      });

      if (res) {
        console.log('res', res);
        setList(res);
      } else {
        setList([]);
      }
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

  const _onGoDetail = item => {
    if (!item?.Id) {
      return;
    }
    navigate(RouteName.HAND_LIST_DETAIL, {
      handListId: item.Id,
    });
  };

  const _renderItem = ({item, index}) => {
    return <ItemView item={item} index={index} onGoDetail={_onGoDetail} />;
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
        keyExtractor={(item, index) => item.Id + ''}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  return (
    <SafeViewWithBg customHeader={() => <Header title={'handList'} />}>
      <View style={styles.container}>{renderContent()}</View>
    </SafeViewWithBg>
  );
};

export default HandList;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });

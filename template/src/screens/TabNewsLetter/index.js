import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import SearchBar from 'src/components/SearchBar';
import {useTheme} from '@react-navigation/native';
import {shallowEqual, useSelector} from 'react-redux';
import {getListNewsletter} from 'src/api/other';
import _ from 'lodash';
import ItemNewsLetter from './ItemNewsLetter';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import CustomIndicator from 'src/components/CustomIndicator';
import EmptyAndReload from 'src/components/EmptyAndReload';
import {handleAlertError} from 'src/api/axios';
import {delay} from 'src/utilities/helper/functional';

const TabNewsLetter = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const ref = useRef({
    page: 0,
    rawData: [],
    textSearch: '',
    searchBar: null,
  }).current;

  const {projectId, zoneId, towerId} = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const [list, setList] = useState(null);
  const [isEnd, setEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emptyResHandle = () => {
    setEnd(true);
    if (ref.page === 1) {
      setList([]);
    }
    return;
  };

  const fetchAPI = async () => {
    try {
      ref.page += 1;

      const res = await getListNewsletter({
        projectId,
        zoneId,
        towerId,
        page: ref.page,
        query: ref.textSearch,
      });

      console.log('res', res);

      if (!res) {
        emptyResHandle();
      }

      if (res && Array.isArray(res)) {
        if (_.isEmpty(res)) {
          emptyResHandle(res);
        }
        ref.rawData = ref.rawData.concat(res);

        setList(ref.rawData);
      } else {
        setEnd(true);
      }
    } catch (error) {
      handleAlertError(error?.message);
    } finally {
    }
  };

  const onRefresh = async (isSearch = false) => {
    setRefreshing(true);
    setRefreshing(false);
    setList([]);

    ref.rawData = [];
    ref.page = 0;

    if (!isSearch) {
      ref.searchBar?.onClear();
      ref.textSearch = '';
    }

    setEnd(false);

    await delay(1000);
    fetchAPI();
  };

  const handleOnEndReached = () => {
    if (!isEnd) {
      fetchAPI();
    }
  };

  const _onSearch = txt => {
    ref.textSearch = `Title.Contains("${txt}")`;
    onRefresh(true);
  };

  const _onGoDetail = item => {
    if (!item?.Id) return;
    navigate(RouteName.NEWS_LETTER_DETAIL, {
      newsLetterId: item.Id,
    });
  };

  const _renderFooter = () => {
    if (!isEnd) {
      return <CustomIndicator isEmpty />;
    }
    return null;
  };

  const _renderEmpty = () => {
    //neu ko co list hoac isEnd = true thi show empty
    if ((!list || list?.length === 0) && isEnd) {
      let title = !list ? 'errorTitle' : list?.length === 0 ? 'noData' : '';
      return <EmptyAndReload title={title} onCallback={onRefresh} />;
    }
    return null;
  };

  const _renderItem = ({item, index}) => (
    <ItemNewsLetter item={item} index={index} onGoDetail={_onGoDetail} />
  );

  const renderContent = () => {
    return (
      <FlatList
        data={list}
        keyExtractor={(item, index) => index + ''}
        renderItem={_renderItem}
        ListFooterComponent={_renderFooter}
        ListEmptyComponent={_renderEmpty}
        onEndReachedThreshold={0.5}
        onEndReached={handleOnEndReached}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  return (
    <SafeViewWithBg
      customHeader={() => <Header noLeftIcon title={'newLetter'} />}>
      <View style={styles.container}>
        <SearchBar ref={r => (ref.searchBar = r)} onSearch={_onSearch} />
        {renderContent()}
      </View>
    </SafeViewWithBg>
  );
};

export default TabNewsLetter;

const makeStyles = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
};

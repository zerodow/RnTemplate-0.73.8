import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import IconSVG from 'src/assets/icons/IconSVG';
import SearchBar from 'src/components/SearchBar';
import ItemNoti from './ItemNoti';
import {navigate} from 'src/utilities/helper/navigationHelper';
import {getListNoti} from 'src/api/noti';
import {useSelector} from 'react-redux';
import {handleAlertError} from 'src/api/axios';
import CustomIndicator from 'src/components/CustomIndicator';
import EmptyAndReload from 'src/components/EmptyAndReload';
import {delay} from 'src/utilities/helper/functional';
import RouteName from 'src/routes/RouteName';
import MenuFilter from './MenuFilter';

const TabNoti = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const ref = useRef({
    page: 0,
    maxSize: 0,
    rawData: [],
    searchBar: null,
    textSearch: '',
    readStatus: null,
  }).current;

  const userId = useSelector(state => state.AuthReducer.userId);

  const [listNoti, setListNoti] = useState(null);
  const [isEnd, setEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAPI = async () => {
    try {
      ref.page += 1;

      const res = await getListNoti({
        userId,
        page: ref.page,
        QueryString: ref.textSearch,
        IsRead: ref.readStatus,
      });

      if (!res) {
        return setEnd(true);
      }

      if (res.Results) {
        ref.rawData = ref.rawData.concat(res.Results);
        ref.maxSize = res.RowCount;
        setListNoti(ref.rawData);
        if (
          (ref.maxSize === ref.rawData.length && ref.rawData.length !== 0) ||
          (ref.page === 1 && ref.rawData.length === 0)
        ) {
          setEnd(true);
        }
      } else {
        setEnd(true);
      }
    } catch (error) {
      handleAlertError(error?.message);
    } finally {
    }
  };

  const _onSearch = txt => {
    ref.textSearch = txt;
    onRefresh(true);
  };

  const _onGoDetail = item => {
    navigate(RouteName.DETAIL_NOTI, {
      id: item.Id,
      detail: item,
    });
  };

  const onRefresh = async (isSearch = false) => {
    setRefreshing(true);
    setRefreshing(false);
    setListNoti([]);

    ref.rawData = [];
    ref.maxSize = 0;
    ref.page = 0;
    ref.readStatus = null;

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

  const handleFilter = status => {
    ref.readStatus = status;
  };

  const _renderFooter = () => {
    if (!isEnd) {
      return <CustomIndicator isEmpty />;
    }
    return null;
  };

  const _renderEmpty = () => {
    //neu ko co listNoti hoac isEnd = true thi show empty
    if ((!listNoti || listNoti?.length === 0) && isEnd) {
      let title = !listNoti
        ? 'errorTitle'
        : listNoti?.length === 0
        ? 'noData'
        : '';
      return <EmptyAndReload title={title} onCallback={onRefresh} />;
    }
    return null;
  };

  const _renderItem = ({item, index}) => {
    return <ItemNoti item={item} index={index} onGoDetail={_onGoDetail} />;
  };

  return (
    <SafeViewWithBg
      customHeader={() => (
        <Header
          noLeftIcon
          title={'noti'}
          customRenderRight={() => <MenuFilter onFilter={handleFilter} />}
        />
      )}>
      <View style={styles.container}>
        <SearchBar ref={r => (ref.searchBar = r)} onSearch={_onSearch} />
        <FlatList
          data={listNoti}
          keyExtractor={(item, index) => item.Id + ''}
          renderItem={_renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={_renderFooter}
          ListEmptyComponent={_renderEmpty}
          onEndReachedThreshold={0.5}
          onEndReached={handleOnEndReached}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeViewWithBg>
  );
};

export default TabNoti;

const makeStyles = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
};

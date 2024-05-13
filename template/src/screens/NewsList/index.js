import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import {getListNews} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import Swiper from 'src/components/Swiper';
import TouchableDebounce from 'src/components/TouchableDebounce';
import ImageView from 'src/components/ImageView';
import {
  AppFont,
  AppStyles,
  FORMAT_TIME_NEWS_LETTER,
} from 'src/utilities/constants';
import TextView from 'src/components/TextView';
import moment from 'moment';
import {deviceWidth} from 'src/utilities/layout';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import CustomIndicator from 'src/components/CustomIndicator';
import _ from 'lodash';
import EmptyAndReload from 'src/components/EmptyAndReload';
import {handleAlertError} from 'src/api/axios';
import {delay} from 'src/utilities/helper/functional';

const SWIPER_HEIGHT = (deviceWidth - 50) / 2 + 75;

const ITEM_WIDTH = deviceWidth - 30 - 20;

const HORIZONTAL_ITEM_WIDTH = (deviceWidth - 40) / 2;

const NewsList = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const ref = useRef({
    page: 0,
    rawData: [],
  }).current;

  const {projectId, zoneId, towerId} = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const [list, setList] = useState(null);
  const [listNews, setListNews] = useState(null);
  const [isEnd, setEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAPI();
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

      const res = await getListNews({
        projectId,
        towerId,
        zoneId,
        page: ref.page,
      });

      console.log('res', res);

      if (!res) {
        return emptyResHandle();
      }

      if (res && Array.isArray(res)) {
        if (_.isEmpty(res)) {
          emptyResHandle();
        }
        ref.rawData = ref.rawData.concat(res);
        setListNews(
          ref.rawData.length <= 4
            ? ref.rawData
            : ref.rawData.filter((item, index) => index <= 4),
        );
        setList(ref.rawData);
      } else {
      }
    } catch (error) {
      handleAlertError(error?.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
    setList([]);

    ref.rawData = [];
    ref.page = 0;

    setEnd(false);

    await delay(1000);
    fetchAPI();
  };

  const handleItemPress = item => {
    if (!item?.Id) return;
    navigate(RouteName.NEWS_LETTER_DETAIL, {
      newsLetterId: item.Id,
    });
  };

  const handleOnEndReached = () => {
    if (!isEnd) {
      fetchAPI();
    }
  };

  const _renderFooter = () => {
    if (!isEnd) {
      return <CustomIndicator isEmpty />;
    }
    return null;
  };

  const _renderEmpty = () => {
    let title = !list ? 'errorTitle' : list?.length === 0 ? 'noData' : '';
    return <EmptyAndReload title={title} onCallback={onRefresh} />;
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableDebounce
        style={[
          styles.item,
          AppStyles.shadow2,
          index % 2 === 0 && {marginRight: 10},
        ]}
        onPress={() => handleItemPress(item)}>
        <ImageView uri={item?.Image} style={styles.horizonImgStyle} />
        <TextView numberOfLines={2} style={styles.content}>
          {item?.Title}
        </TextView>
        <TextView style={styles.time2}>
          {moment(item?.CreatedAt).format(FORMAT_TIME_NEWS_LETTER)}
        </TextView>
      </TouchableDebounce>
    );
  };

  const renderContent = () => {
    if (ref.page === 0) {
      return <CustomIndicator style={{marginTop: 25}} />;
    }
    if (!list || list?.length === 0) {
      return _renderEmpty();
    }

    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <TextView keyLang="hotNew" style={styles.titleStyle} />
        <View style={styles.hotNewsStyle}>
          {listNews?.length !== 0 && (
            <Swiper
              style={styles.wrapper}
              showsButtons={false}
              autoplay={true}
              activeDotColor={colors.yellow}
              dotColor={colors.white}
              paginationStyle={styles.pageStyle}>
              {listNews.map((item, index) => (
                <TouchableDebounce
                  key={index}
                  style={{width: deviceWidth - 50}}
                  onPress={() => handleItemPress(item)}>
                  <ImageView uri={item?.Image} style={styles.imgStyle} />
                  <TextView numberOfLines={2} style={styles.titleV2}>
                    {item.Title}
                  </TextView>
                  <TextView style={styles.time}>
                    {moment(item.CreatedAt).format(FORMAT_TIME_NEWS_LETTER)}
                  </TextView>
                </TouchableDebounce>
              ))}
            </Swiper>
          )}
        </View>
        <TextView keyLang="otherNew" style={styles.titleStyle} />
        <FlatList
          data={list}
          keyExtractor={(item, index) => item.Id + ''}
          scrollEnabled={false}
          numColumns={2}
          renderItem={_renderItem}
          contentContainerStyle={{marginHorizontal: 15}}
          ListFooterComponent={_renderFooter}
          ListEmptyComponent={_renderEmpty}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={handleOnEndReached}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </ScrollView>
    );
  };

  return (
    <SafeViewWithBg customHeader={() => <Header title={'news'} />}>
      {renderContent()}
    </SafeViewWithBg>
  );
};

export default NewsList;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 15,
    },
    titleStyle: {
      paddingHorizontal: 15,
      fontSize: AppFont.fontSize.s18,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary1,
      marginBottom: 15,
    },
    wrapper: {
      height: SWIPER_HEIGHT,
      backgroundColor: 'white',
    },
    titleV2: {
      marginVertical: 10,
      fontSize: AppFont.fontSize.s15,
      fontWeight: AppFont.fontWeight.bold,
      color: colors.neutral3,
    },
    time: {textAlign: 'right', fontSize: AppFont.fontSize.s13},
    imgStyle: {
      width: ITEM_WIDTH,
      height: ITEM_WIDTH / 2,
      borderRadius: 15,
    },
    pageStyle: {position: 'absolute', bottom: 80},
    hotNewsStyle: {
      height: SWIPER_HEIGHT + 20,
      backgroundColor: 'white',
      marginHorizontal: 15,
      padding: 10,
      borderRadius: 9,
      marginBottom: 20,
      ...AppStyles.shadow2,
    },
    item: {
      width: HORIZONTAL_ITEM_WIDTH,
      borderRadius: 12,
      marginBottom: 20,
      zIndex: 1,
      backgroundColor: 'white',
    },
    horizonImgStyle: {
      width: HORIZONTAL_ITEM_WIDTH,
      height: HORIZONTAL_ITEM_WIDTH / 1.2,
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
    },
    content: {
      paddingHorizontal: 5,
      color: colors.neutral3,
      paddingVertical: 8,
      fontWeight: AppFont.fontWeight.regular,
      fontSize: AppFont.fontSize.s13,
    },
    time2: {
      textAlign: 'right',
      fontSize: AppFont.fontSize.s12,
      paddingHorizontal: 5,
      paddingBottom: 5,
    },
  });

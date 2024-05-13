import {View, StyleSheet, FlatList} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTheme} from '@react-navigation/native';
import TextView from 'src/components/TextView';
import {AppFont, AppStyles} from 'src/utilities/constants';
import {deviceWidth} from 'src/utilities/layout';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {getListNews} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import ImageView from 'src/components/ImageView';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import CustomIndicator from 'src/components/CustomIndicator';
import EmptyAndReload from 'src/components/EmptyAndReload';

const ITEM_WIDTH = (deviceWidth - 40) / 2;

const ListNews = (props, _ref) => {
  useImperativeHandle(_ref, () => ({fetchAPI}));

  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {projectId, zoneId, towerId} = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const [list, setList] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    try {
      setLoading(true);

      const res = await getListNews({
        projectId,
        zoneId,
        towerId,
        page: 1,
        page_size: 4,
      });
      // console.log('res', res);
      if (res) {
        setList(res);
      } else {
        setList([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    fetchAPI();
  };

  const goListNews = () => {
    navigate(RouteName.NEWS_LIST);
  };

  const goDetail = item => {
    if (!item?.Id) {
      return;
    }
    navigate(RouteName.NEWS_LETTER_DETAIL, {
      newsLetterId: item.Id,
    });
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableDebounce
        style={[
          styles.item,
          AppStyles.shadow2,
          index % 2 === 0 && {marginRight: 10},
        ]}
        onPress={() => goDetail(item)}>
        <ImageView uri={item?.Image} style={styles.imgStyle} />
        <TextView numberOfLines={2} style={styles.content}>
          {item?.Title}
        </TextView>
      </TouchableDebounce>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <CustomIndicator isEmpty />;
    }
    if (!list || list?.length === 0) {
      let title = !list ? 'errorTitle' : list?.length === 0 ? 'noData' : '';
      return <EmptyAndReload title={title} onCallback={onRefresh} />;
    }
    return (
      <View>
        <FlatList
          data={list}
          keyExtractor={(item, index) => item.Id + ''}
          scrollEnabled={false}
          numColumns={2}
          renderItem={_renderItem}
          contentContainerStyle={{marginHorizontal: 15}}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.space} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableDebounce onPress={goListNews}>
        <TextView keyLang="news" style={styles.titleStyle} />
      </TouchableDebounce>
      {renderContent()}
    </View>
  );
};

export default forwardRef(ListNews);

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      marginTop: 15,
    },
    titleStyle: {
      paddingHorizontal: 15,
      fontSize: AppFont.fontSize.s20,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary1,
      marginBottom: 15,
    },
    item: {
      width: ITEM_WIDTH,
      borderRadius: 12,
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,
      zIndex: 1,
      backgroundColor: 'white',
    },
    content: {
      paddingHorizontal: 5,
      color: colors.neutral3,
      paddingVertical: 8,
      fontSize: AppFont.fontSize.s13,
    },
    imgStyle: {
      width: ITEM_WIDTH,
      height: ITEM_WIDTH / 1.2,
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
    },
    space: {
      height: 20,
    },
  });

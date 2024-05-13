import {View, StyleSheet} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  AppFont,
  FORMAT_TIME_NEWS,
  FORMAT_TIME_NEWS_LETTER,
  IMAGE_URL,
} from 'src/utilities/constants';
import TextView from 'src/components/TextView';
import {deviceWidth} from 'src/utilities/layout';
import Swiper from 'src/components/Swiper';
import {getListNewsletter} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import moment from 'moment';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import ImageView from 'src/components/ImageView';
import CustomIndicator from 'src/components/CustomIndicator';
import EmptyAndReload from 'src/components/EmptyAndReload';
import {handleAlertError} from 'src/api/axios';

const SWIPER_HEIGHT = (deviceWidth - 30) / 2 + 80;

const ITEM_WIDTH = deviceWidth - 30;

const ResidentNewLetter = (props, _ref) => {
  useImperativeHandle(_ref, () => ({fetchAPI}));
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {projectId, zoneId, towerId} = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const ref = useRef({
    firstLoad: true,
  }).current;

  const [list, setList] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    try {
      setLoading(true);
      const res = await getListNewsletter({
        projectId,
        zoneId,
        towerId,
        page: 1,
        page_size: 3,
      });
      console.log('res', res);

      if (res) {
        setList(res);
      } else {
        setList([]);
      }
    } catch (error) {
      handleAlertError(error?.message);
    } finally {
      ref.firstLoad = false;
      setLoading(false);
    }
  };

  const onRefresh = () => {
    fetchAPI();
  };

  const handleItemPress = item => {
    if (!item?.Id) return;
    navigate(RouteName.NEWS_LETTER_DETAIL, {
      newsLetterId: item.Id,
    });
  };

  const goNewLetterList = () => {
    navigate(RouteName.TAB_NEWS_LETTER);
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
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        autoplay={true}
        activeDotColor={colors.yellow}
        dotColor={colors.white}
        paginationStyle={styles.pageStyle}>
        {list.map((item, index) => (
          <TouchableDebounce
            key={index}
            style={{width: deviceWidth - 40}}
            onPress={() => handleItemPress(item)}>
            <ImageView uri={item?.Image} style={styles.imgStyle} />
            <View>
              <TextView style={styles.titleV2}>{item.Title}</TextView>
              <TextView style={styles.time}>
                {moment(item.CreatedAt).format(FORMAT_TIME_NEWS_LETTER)}
              </TextView>
            </View>
          </TouchableDebounce>
        ))}
      </Swiper>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableDebounce onPress={goNewLetterList}>
        <TextView keyLang="newLetter" style={styles.titleStyle} />
      </TouchableDebounce>
      {renderContent()}
    </View>
  );
};

export default forwardRef(ResidentNewLetter);

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      marginTop: 15,
      backgroundColor: 'white',
    },
    titleStyle: {
      paddingHorizontal: 15,
      fontSize: AppFont.fontSize.s20,
      fontWeight: AppFont.fontWeight.superBold,
      color: colors.primary1,
      marginBottom: 15,
    },
    wrapper: {
      marginHorizontal: 15,
      height: SWIPER_HEIGHT,
      backgroundColor: 'white',
    },
    titleV2: {
      marginVertical: 10,
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
      color: colors.neutral1,
    },
    time: {textAlign: 'right'},
    imgStyle: {
      width: ITEM_WIDTH,
      height: ITEM_WIDTH / 2,
      borderRadius: 7,
    },
    pageStyle: {position: 'absolute', bottom: 80},
  });

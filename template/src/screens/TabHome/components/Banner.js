import {Linking, StyleSheet} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import SwipeDeck from 'src/components/SwipeDeck';
import TouchableDebounce from 'src/components/TouchableDebounce';
import ImageView from 'src/components/ImageView';
import {useTheme} from '@react-navigation/native';
import {deviceWidth} from 'src/utilities/layout';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import {getListBanner} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import CustomIndicator from 'src/components/CustomIndicator';
import EmptyAndReload from 'src/components/EmptyAndReload';
import {BASE_DOMAIN} from 'src/utilities/constants';

const CARD_WIDTH = deviceWidth - 40;
const CARD_HEIGHT = (deviceWidth - 40) / 1.7;

const Banner = (props, _ref) => {
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

      const res = await getListBanner({
        projectId,
        zoneId,
        towerId,
      });

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

  const goDetail = item => {
    //nếu có Id và url trùng với domain của app
    if (item?.Url && item?.Url?.includes(BASE_DOMAIN) && item?.Id) {
      return navigate(RouteName.DETAIL_BANNER, {
        bannerId: item.Id,
      });
    }
    if (item?.Url) {
      return Linking.canOpenURL(item.Url)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: ");
          } else {
            return Linking.openURL(item.Url);
          }
        })
        .catch(err => console.log('An error occurred', err));
    }
  };

  const renderCard = item => {
    return (
      <TouchableDebounce
        disabled={!item?.Url}
        key={item.Id}
        onPress={() => goDetail(item)}>
        <ImageView uri={item?.Image} style={styles.cardStyle} />
      </TouchableDebounce>
    );
  };

  if (isLoading) {
    return <CustomIndicator isEmpty />;
  }
  if (!list || list?.length === 0) {
    let title = !list ? 'errorTitle' : list?.length === 0 ? 'noData' : '';
    return <EmptyAndReload title={title} onCallback={onRefresh} />;
  }

  return (
    <SwipeDeck
      autoPlay={true}
      containerHeight={CARD_HEIGHT + 30}
      data={list}
      renderCard={renderCard}
    />
  );
};

export default forwardRef(Banner);

const makeStyles = colors =>
  StyleSheet.create({
    cardStyle: {
      borderRadius: 12,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      marginHorizontal: 15,
    },
  });

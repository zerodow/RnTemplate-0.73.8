import {View, StyleSheet, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import TextView from 'src/components/TextView';
import {AppFont, AppStyles} from 'src/utilities/constants';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import {deviceWidth} from 'src/utilities/layout';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {navigate} from 'src/utilities/helper/navigationHelper';
import RouteName from 'src/routes/RouteName';
import {getListQuestion} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import CustomIndicator from 'src/components/CustomIndicator';
import EmptyAndReload from 'src/components/EmptyAndReload';
import {handleAlertError} from 'src/api/axios';

const QuestionList = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {projectId, zoneId, towerId} = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    try {
      setLoading(true);
      const res = await getListQuestion({
        projectId,
        zoneId,
        towerId,
      });
      console.log('res', res);
      setList(res || []);
    } catch (error) {
      handleAlertError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    fetchAPI();
  };

  const toDetail = useCallback(item => {
    if (!item?.Id) return;
    navigate(RouteName.QUESTION_DETAIL, {
      questionId: item.Id,
    });
    // navigate(RouteName.QUESTION_DETAIL);
  }, []);

  const _renderItem = ({item, index}) => {
    return (
      <TouchableDebounce
        style={styles.itemContainer}
        onPress={() => toDetail(item)}>
        <TextView style={styles.titleStyle}>{item.Title}</TextView>
        <Icon source={IconSVG.more} size={18} />
      </TouchableDebounce>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <CustomIndicator isEmpty />;
    }
    if (!list || list?.length === 0) {
      let title = !list ? 'errorTitle' : list?.length === 0 ? 'noData' : '';
      return <EmptyAndReload title={title} onCallback={onRefresh} />;
    }
    return (
      <FlatList
        data={list}
        keyExtractor={(item, index) => index + ''}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeViewWithBg customHeader={() => <Header title={'question'} />}>
      <View style={styles.container}>{renderContent()}</View>
    </SafeViewWithBg>
  );
};

export default QuestionList;

const makeStyles = colors =>
  StyleSheet.create({
    container: {flex: 1},
    itemContainer: {
      alignSelf: 'center',
      justifyContent: 'space-between',
      width: deviceWidth - 30,
      backgroundColor: 'white',
      flexDirection: 'row',
      borderRadius: 10,
      paddingVertical: 10,
      paddingRight: 10,
      paddingLeft: 15,
      marginHorizontal: 15,
      marginVertical: 10,
      ...AppStyles.shadow2,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
      color: colors.neutral3,
    },
  });

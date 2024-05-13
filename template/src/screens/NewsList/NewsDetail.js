import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import {getDetailNewsletter} from 'src/api/other';
import {AppFont} from 'src/utilities/constants';
import HTMLContent from 'src/components/HTMLContent';

const NewsDetail = ({route}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  //data pass route
  const {id} = route.params;

  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetchAPI();
  }, [id]);

  const fetchAPI = async () => {
    const res = await getDetailNewsletter({
      newId: id,
    });

    if (res) {
      setDetail(res);
    }
  };

  const renderDetail = useCallback(
    () => <HTMLContent data={detail} />,
    [detail],
  );

  const renderLoading = useCallback(() => <ActivityIndicator />, []);

  return (
    <SafeViewWithBg customHeader={() => <Header title={'detail'} />}>
      <View style={styles.container}>
        {detail ? renderDetail() : renderLoading()}
      </View>
    </SafeViewWithBg>
  );
};

export default NewsDetail;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
    },
    title: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.bold,
      color: colors.primary1,
    },
    time: {
      fontSize: AppFont.fontSize.s13,
      fontWeight: AppFont.fontWeight.normal,
      color: colors.neutral4,
      textAlign: 'right',
      marginVertical: 10,
    },
  });

import {View, StyleSheet, Linking} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import {getDetailNewsletter} from 'src/api/other';
import {AppFont} from 'src/utilities/constants';
import CustomIndicator from 'src/components/CustomIndicator';
import HTML from 'react-native-render-html';
import HTMLContent from 'src/components/HTMLContent';
import Attachment from 'src/components/Attachments';

const QuestionDetail = ({route}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  //data pass route
  const {handListId} = route.params;

  const [detail, setDetail] = useState(null);

  const haveAttachments = useMemo(
    () => detail?.attactments && detail?.attactments.length !== 0,
    [detail],
  );

  useEffect(() => {
    fetchAPI();
  }, [handListId]);

  const fetchAPI = async () => {
    const res = await getDetailNewsletter({
      newId: handListId,
    });

    if (res) {
      setDetail({
        ...res,
      });
    }
  };

  const renderDetail = useCallback(() => {
    return (
      <View style={styles.container}>
        <HTMLContent data={detail} showImageTitle={false} />
        {haveAttachments ? <Attachment data={detail.attactments} /> : null}
      </View>
    );
  }, [detail]);

  const renderLoading = useCallback(
    () => <CustomIndicator style={{marginTop: 20}} />,
    [],
  );

  return (
    <SafeViewWithBg customHeader={() => <Header title={'handList'} />}>
      <View style={{flex: 1}}>{detail ? renderDetail() : renderLoading()}</View>
    </SafeViewWithBg>
  );
};

export default QuestionDetail;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
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

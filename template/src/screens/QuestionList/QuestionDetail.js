import {View, StyleSheet, Linking} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import {getDetailNewsletter} from 'src/api/other';
import {AppFont} from 'src/utilities/constants';
import CustomIndicator from 'src/components/CustomIndicator';
import HTML from 'react-native-render-html';
import CustomImage from 'src/components/CustomImage';
import {deviceWidth} from 'src/utilities/layout';

const QuestionDetail = ({route}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  //data pass route
  const {questionId} = route.params;

  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetchAPI();
  }, [questionId]);

  const fetchAPI = async () => {
    const res = await getDetailNewsletter({
      newId: questionId,
    });

    if (res) {
      setDetail({
        ...res,
      });
    }
  };

  const defaultRenderer = {
    renderers: {
      img: (htmlAttribs, children, convertedCSSStyles, passProps) => (
        <CustomImage src={htmlAttribs.src} />
      ),
    },
  };

  const renderDetail = useCallback(() => {
    return (
      <View style={styles.container}>
        <HTML
          {...defaultRenderer}
          ignoredStyles={['display', 'font-family', 'height']}
          html={detail.Contents}
          imagesMaxWidth={deviceWidth - 30}
          onLinkPress={(event, href) => {
            Linking.openURL(href);
          }}
          tagsStyles={{
            p: {
              marginBottom: 3,
            },
          }}
        />
      </View>
    );
  }, [detail]);

  const renderLoading = useCallback(
    () => <CustomIndicator style={{marginTop: 20}} />,
    [],
  );

  return (
    <SafeViewWithBg customHeader={() => <Header title={'detail'} />}>
      {detail ? renderDetail() : renderLoading()}
    </SafeViewWithBg>
  );
};

export default QuestionDetail;

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

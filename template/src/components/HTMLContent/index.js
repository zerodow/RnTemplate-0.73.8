import {Linking, ScrollView, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import HTML from 'react-native-render-html';
import moment from 'moment';
import {AppFont, FORMAT_TIME_NEWS_LETTER} from 'src/utilities/constants';
import {deviceWidth} from 'src/utilities/layout';
import CustomImage from '../CustomImage';
import TextView from '../TextView';
import {useTheme} from '@react-navigation/native';
import ImageView from '../ImageView';

const HTMLContent = ({data, onGoDetail, showImageTitle = true}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const defaultRenderer = {
    renderers: {
      img: (htmlAttribs, children, convertedCSSStyles, passProps) => (
        <CustomImage key={htmlAttribs.src} src={htmlAttribs.src} />
      ),
    },
  };

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 20}}
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <TextView style={styles.title}>{data?.Title}</TextView>
      <TextView style={styles.time}>
        {moment(data?.CreatedAt).format(FORMAT_TIME_NEWS_LETTER)}
      </TextView>

      {showImageTitle && (
        <ImageView
          uri={data?.Image}
          style={{
            width: deviceWidth - 30,
            height: (deviceWidth - 30) / 2,
          }}
        />
      )}
      <View style={styles.space} />
      <HTML
        {...defaultRenderer}
        ignoredStyles={['display', 'font-family', 'height']}
        html={data.Contents}
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
    </ScrollView>
  );
};

export default memo(HTMLContent);

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
    space: {
      height: 10,
    },
  });

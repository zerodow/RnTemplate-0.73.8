import {View, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';

const NewsLetterList = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  return (
    <SafeViewWithBg customHeader={() => <Header title={'noti'} />}>
      <View style={styles.container}></View>
    </SafeViewWithBg>
  );
};

export default NewsLetterList;

const makeStyles = colors =>
  StyleSheet.create({
    container: {},
  });

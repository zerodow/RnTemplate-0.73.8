import {View, StyleSheet} from 'react-native';
import React, {useCallback} from 'react';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import {useTheme} from '@react-navigation/native';
import CustomIndicator from 'src/components/CustomIndicator';
import HTMLContent from 'src/components/HTMLContent';

const DetailNoti = ({route}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const {detail} = route.params;

  const renderDetail = useCallback(
    () => <HTMLContent data={detail} />,
    [detail],
  );

  const renderLoading = useCallback(() => <CustomIndicator />, []);

  return (
    <SafeViewWithBg customHeader={() => <Header title={'noti'} />}>
      <View style={styles.container}>
        {detail ? renderDetail() : renderLoading()}
      </View>
    </SafeViewWithBg>
  );
};

export default DetailNoti;

const makeStyles = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
};

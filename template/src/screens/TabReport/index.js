import {View, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import SafeViewWithBg from 'src/components/SafeViewWithBg';
import Header from 'src/components/SafeViewWithBg/Header';
import IconSVG from 'src/assets/icons/IconSVG';
import {useTheme} from '@react-navigation/native';
import {TabView} from 'react-native-tab-view';
import {deviceWidth} from 'src/utilities/layout';
import TextView from 'src/components/TextView';
import TouchableDebounce from 'src/components/TouchableDebounce';
import {AppFont, AppStyles} from 'src/utilities/constants';
import EmptyAndReload from 'src/components/EmptyAndReload';

const TabReport = () => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'all', title: 'Tất cả'},
    {key: 'new', title: 'Mới tạo'},
    {key: 'process', title: 'Đang xử lý'},
    {key: 'cancel', title: 'Huỷ'},
    {key: 'finish', title: 'Hoàn thành'},
  ]);

  const FirstRoute = () => (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TextView>1</TextView>
      <EmptyAndReload />
    </View>
  );

  const SecondRoute = () => (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TextView>2</TextView>
      <EmptyAndReload />
    </View>
  );

  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'all':
        return <FirstRoute jumpTo={jumpTo} />;
      case 'new':
        return <SecondRoute jumpTo={jumpTo} />;
      case 'process':
        return <SecondRoute jumpTo={jumpTo} />;
      case 'cancel':
        return <SecondRoute jumpTo={jumpTo} />;
      case 'finish':
        return <SecondRoute jumpTo={jumpTo} />;
      default:
        return null;
    }
  };

  const renderTabBar = () => {
    return (
      <View style={styles.tabBarStyle}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {routes.map((item, ind) => (
            <TouchableDebounce
              key={ind}
              style={[styles.tabItem, ind === index && styles.activeTab]}
              onPress={() => setIndex(ind)}>
              <TextView
                style={[
                  styles.titleStyle,
                  ind === index && styles.titleActive,
                ]}>
                {item.title}
              </TextView>
            </TouchableDebounce>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeViewWithBg
      customHeader={() => (
        <Header noLeftIcon title={'Report'} rightIcon={IconSVG.filter} />
      )}>
      <View style={styles.container}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: deviceWidth}}
        />
      </View>
    </SafeViewWithBg>
  );
};

export default TabReport;

const makeStyles = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    tabBarStyle: {
      height: 50,
      backgroundColor: 'white',
      ...AppStyles.shadow2,
    },
    tabItem: {
      paddingHorizontal: 15,
      justifyContent: 'center',
      height: '100%',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary4,
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s16,
      fontWeight: AppFont.fontWeight.regular,
    },
    titleActive: {
      color: colors.primary4,
    },
  });
};

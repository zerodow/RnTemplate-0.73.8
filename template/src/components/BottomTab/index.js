import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from '../Icons';
import {deviceWidth} from 'src/utilities/layout';
import {navigate} from 'src/utilities/helper/navigationHelper';
import {TabConfig} from 'src/routes/RouteConfig';
import RouteName from 'src/routes/RouteName';
import {hitSlop} from 'src/utilities/helper/functional';
import IconSVG from 'src/assets/icons/IconSVG';
import {img} from 'src/assets';
import {useTranslation} from 'react-i18next';
import TextView from '../TextView';

const ITEM_TAB_WIDTH = (deviceWidth - 70) / 4;
const TAB_HEIGHT = deviceWidth / 4;

const BottomTab = ({state}) => {
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation();

  const styles = makeStyles(colors, bottom);

  const renderTab = () => {
    return (
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            navigate(route.name);
          };

          if (index === 2) {
            return <View key={index} style={styles.space} />;
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabStyle}>
              <Icon
                source={TabConfig[index].icon}
                color={isFocused ? colors.activeTab : colors.unActiveTab}
                size={26}
              />
              <TextView keyLang={route.name} />
              {/* <View style={styles.dot} /> */}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const onGoHome = () => {
    navigate(RouteName.TAB_HOME);
  };

  const renderCenterTab = () => {
    return (
      <TouchableOpacity
        style={styles.centerContainer}
        onPress={onGoHome}
        hitSlop={hitSlop(10)}>
        <View style={styles.centerIcon}>
          <Icon source={IconSVG.home} size={25} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={img.tabBg}
        resizeMode="stretch"
        style={styles.backgroundContainer}>
        {renderTab()}
      </ImageBackground>
      {renderCenterTab()}
    </View>
  );
};

export default BottomTab;

const makeStyles = (colors, bottom) => {
  const bgWidth = bottom ? deviceWidth : deviceWidth + 20;
  const bgHeight = bottom ? deviceWidth / 4.5 : (deviceWidth + 20) / 4.5;
  const paddHorizon = bottom ? 0 : 10;
  const tabPaddBottom = bottom ? 10 : 15;
  const centerTop = bottom ? 3 : 0;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: TAB_HEIGHT,
      width: deviceWidth,
      marginBottom: bottom,
    },
    backgroundContainer: {
      width: bgWidth,
      height: bgHeight,
      paddingHorizontal: paddHorizon,
    },
    tabContainer: {flex: 1, flexDirection: 'row'},
    tabStyle: {
      flex: 1,
      width: ITEM_TAB_WIDTH,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: tabPaddBottom,
    },
    space: {
      width: 70,
    },
    centerContainer: {
      position: 'absolute',
      top: centerTop,
    },
    centerIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: colors.homeIcon,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      position: 'absolute',
      bottom: TAB_HEIGHT / 2,
      right: ITEM_TAB_WIDTH * 0.3,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'red',
    },
  });
};

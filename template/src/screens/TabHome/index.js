import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {AppFont, BLOCK_CODE} from '../../utilities/constants';
import {useTheme} from '@react-navigation/native';
import Icon from '../../components/Icons';
import TextView from 'src/components/TextView';
import {deviceWidth} from 'src/utilities/layout';
import AbsoluteInfo from './components/AbsoluteInfo';
import TouchableDebounce from 'src/components/TouchableDebounce';
import IconSVG from '../../assets/icons/IconSVG';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FormFeature from './components/FormFeature';
import ListNews from './components/ListNews';
import ResidentNewLetter from './components/ResidentNewLetter';
import ListService from './components/ListService';
import {refAbsoluteMenu} from 'src/routes';
import {getAppViewConfig, getHotline} from 'src/api/other';
import {isEmpty} from 'lodash';
import {calHeaderHeight} from 'src/utilities/helper/functional';
// import messaging from '@react-native-firebase/messaging';
import Banner from './components/Banner';
import CustomIndicator from 'src/components/CustomIndicator';
import ListExtension from './components/ListExtension';

const TabHome = () => {
  const {colors} = useTheme();
  const insest = useSafeAreaInsets();
  const styles = makeStyles(colors, insest);

  const [dataHotline, setDataHotline] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [viewBlock, setViewBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  const ref = useRef({
    layout: null,
    listNews: null,
    listNewsLetter: null,
    banner: null,
  }).current;

  const userInfo = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const {projectId = 1, towerId, zoneId} = userInfo;

  useEffect(() => {
    callGetHotline();
    fbInit();
    getConfigHome();
  }, []);

  const getConfigHome = async () => {
    try {
      const res = await getAppViewConfig({
        idProject: projectId,
        idTower: towerId,
      });

      console.log('res', res);

      if (res && res?.listBlocks && res.listBlocks?.length !== 0) {
        setViewBlock({
          listBlocks: res.listBlocks.sort((a, b) => a.Location - b.Location),
          listServices: res.listServices,
          listUtilities: res.listUtilities,
          listFunctions: res.listFunctions,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fbInit = async () => {
    // messaging().registerDeviceForRemoteMessages();
    // const token = await messaging().getToken();
    // const res = await pushTokenFcm(pushTokenSchema({token}));
    // console.log('pushTokenFcm', res);
  };

  const callGetHotline = async () => {
    const res = await getHotline({
      projectId,
      towerId,
      zoneId,
    });

    if (res && !isEmpty(res)) {
      setDataHotline(res);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
    ref.listNews?.fetchAPI();
    ref.listNewsLetter?.fetchAPI();
    ref.banner?.fetchAPI();
  };

  const renderItemView = ({item, index}) => {
    switch (item.Code) {
      case BLOCK_CODE.CN:
        return (
          <FormFeature key={index} listFunctions={viewBlock.listFunctions} />
        );
      case BLOCK_CODE.BT:
        return (
          <ResidentNewLetter key={index} ref={r => (ref.listNewsLetter = r)} />
        );
      case BLOCK_CODE.TI:
        return (
          <ListExtension key={index} listExtensions={viewBlock.listUtilities} />
        );
      case BLOCK_CODE.DV:
        return (
          <ListService key={index} listServices={viewBlock.listServices} />
        );
      case BLOCK_CODE.TT:
        return <ListNews key={index} ref={r => (ref.listNews = r)} />;
      case BLOCK_CODE.QC:
        return <Banner key={index} ref={r => (ref.banner = r)} />;
      default:
        break;
    }
  };

  const renderMainService = () => {
    if (loading && !viewBlock) {
      <CustomIndicator />;
    }

    if (!viewBlock?.listBlocks) {
      return (
        <>
          <FormFeature />
          <ResidentNewLetter ref={r => (ref.listNewsLetter = r)} />
          <ListExtension />
          <ListNews ref={r => (ref.listNews = r)} />
          <Banner ref={r => (ref.banner = r)} />
          <ListService />
        </>
      );
    }
    return (
      <>
        {viewBlock.listBlocks.map((item, index) =>
          renderItemView({item, index}),
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ImageBackground
          source={calHeaderHeight(insest.top, true).source}
          resizeMode="stretch"
          style={styles.bgContainer}>
          <View style={styles.row}>
            <TouchableDebounce>
              <TextView numberOfLines={1} style={styles.apart}>
                {userInfo.apartmentName}
              </TextView>
            </TouchableDebounce>
          </View>
        </ImageBackground>
        <AbsoluteInfo />
        <View style={styles.space} />
        {renderMainService()}
      </ScrollView>
      {dataHotline && (
        <View
          style={styles.floatStyle}
          onLayout={event => (ref.layout = event.nativeEvent.layout)}>
          <Icon
            source={IconSVG.float}
            size={50}
            onPress={() =>
              refAbsoluteMenu?.show({layout: ref.layout, data: dataHotline})
            }
          />
        </View>
      )}
    </View>
  );
};

export default memo(TabHome);

const makeStyles = (colors, insest) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    bgContainer: {
      width: deviceWidth,
      height: calHeaderHeight(insest.top, true).height,
    },
    row: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      marginTop: insest.top ? insest.top + 10 : 20,
    },
    apart: {
      fontSize: AppFont.fontSize.s18,
      color: colors.white,
      fontWeight: AppFont.fontWeight.superBold,
    },
    space: {
      height: 50,
    },
    floatStyle: {
      position: 'absolute',
      right: 15,
      bottom: 0,
    },
  });
};

import {StyleSheet, View} from 'react-native';
import React, {memo, useMemo, useState} from 'react';
import TouchableDebounce from 'src/components/TouchableDebounce';
import TextView from 'src/components/TextView';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import {deviceWidth} from 'src/utilities/layout';
import {AppFont, AppStyles} from 'src/utilities/constants';
import {useTheme} from '@react-navigation/native';
import {getDetailNoteBook} from 'src/api/other';
import {shallowEqual, useSelector} from 'react-redux';
import {handleAlertError} from 'src/api/axios';
import CustomIndicator from 'src/components/CustomIndicator';

const ItemView = ({item, index, onGoDetail}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const [status, setStatus] = useState({
    loading: false,
    isExpand: false,
  });

  const [listChild, setListChild] = useState([]);

  const icon = useMemo(() => {
    return status.isExpand ? IconSVG.arrow_down : IconSVG.more;
  }, [status.isExpand]);

  const {projectId, zoneId, towerId} = useSelector(
    state => state.AuthReducer.userInfo,
    shallowEqual,
  );

  const getChild = async () => {
    setStatus(prev => ({...prev, loading: true}));
    try {
      const res = await getDetailNoteBook({
        projectId,
        zoneId,
        towerId,
        idc: item.Id,
      });

      if (res) {
        console.log('res', res);
        setListChild(res);
      } else {
        setListChild([]);
      }
    } catch (error) {
      handleAlertError(error?.message);
    } finally {
      setStatus({
        loading: false,
        isExpand: true,
      });
    }
  };

  const onExpand = () => {
    if (status.isExpand) {
      return setStatus(prev => ({...prev, isExpand: false}));
    }

    if (!status.isExpand && listChild && listChild?.length !== 0) {
      return setStatus(prev => ({...prev, isExpand: true}));
    }

    getChild();
  };

  const renderListChild = () => {
    if (status.isExpand && listChild && listChild.length !== 0) {
      return (
        <>
          {listChild.map((ele, ind) => (
            <TouchableDebounce
              key={ind}
              style={styles.subWrapper}
              onPress={() => onGoDetail(ele)}>
              <TextView style={styles.number}>{`${ind + 1}. `}</TextView>
              <TextView style={styles.subTitle}>{ele.Title}</TextView>
            </TouchableDebounce>
          ))}
        </>
      );
    }
    return null;
  };

  return (
    <View>
      <TouchableDebounce style={styles.itemContainer} onPress={onExpand}>
        <View style={{flex: 1}}>
          <TextView style={styles.titleStyle}>{item.Name}</TextView>
        </View>
        <Icon source={icon} size={18} />
      </TouchableDebounce>
      {status.loading && <CustomIndicator />}
      {renderListChild()}
    </View>
  );
};

export default memo(ItemView);

const makeStyles = colors =>
  StyleSheet.create({
    itemContainer: {
      alignItems: 'center',
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
    subWrapper: {
      paddingVertical: 15,
      marginHorizontal: 20,
      borderBottomWidth: 0.5,
      borderColor: colors.borderColor,
      flexDirection: 'row',
      width: deviceWidth - 40,
    },
    number: {
      fontSize: AppFont.fontSize.s14,
      fontWeight: AppFont.fontWeight.regular,
      color: colors.red,
    },
    subTitle: {
      fontSize: AppFont.fontSize.s14,
      fontWeight: AppFont.fontWeight.regular,
      color: colors.neutral2,
      flex: 1,
    },
  });

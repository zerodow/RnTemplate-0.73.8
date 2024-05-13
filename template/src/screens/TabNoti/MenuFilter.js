import {useTheme} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import IconSVG from 'src/assets/icons/IconSVG';
import Icon from 'src/components/Icons';
import Menu from 'src/components/MenuModal/Menu';
import MenuItem from 'src/components/MenuModal/MenuItem';
import {READ_STATUS} from 'src/utilities/constants';
import {delay, hitSlop} from 'src/utilities/helper/functional';

const MenuFilter = ({onFilter}) => {
  const menuRef = useRef(null);
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const [status, setStatus] = useState(READ_STATUS.ALL);

  const icon = useMemo(() => {
    switch (status) {
      case READ_STATUS.ALL:
        return IconSVG.filter;
      case READ_STATUS.READ:
        return IconSVG.read;
      case READ_STATUS.UNREAD:
        return IconSVG.unread;
      default:
        return IconSVG.filter;
    }
  }, [status]);

  const dismiss = useCallback(async () => {
    await menuRef?.current?.hide();
  }, []);

  const show = useCallback(async () => {
    menuRef?.current?.show();
  }, []);

  const callFilter = useCallback(
    async readStatus => {
      setStatus(readStatus);
      await dismiss();
      await delay(200);

      onFilter && onFilter(readStatus);
    },
    [onFilter],
  );

  return (
    <Menu
      style={styles.container}
      ref={menuRef}
      button={<Icon source={icon} onPress={show} hitSlop={hitSlop(10)} />}>
      <MenuItem
        onPress={() => callFilter(READ_STATUS.READ)}
        icon={IconSVG.read}>
        {'read'}
      </MenuItem>
      <MenuItem
        onPress={() => callFilter(READ_STATUS.UNREAD)}
        icon={IconSVG.unread}>
        {'unread'}
      </MenuItem>
      <MenuItem
        onPress={() => callFilter(READ_STATUS.ALL)}
        icon={IconSVG.filter}>
        {'all'}
      </MenuItem>
    </Menu>
  );
};

export default MenuFilter;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      marginRight: 10,
      borderRadius: 10,
      backgroundColor: colors.btnSecondBg,
    },
    itemStyle: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLine,
    },
  });

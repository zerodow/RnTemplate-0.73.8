import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Linking} from 'react-native';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import MarkOnCamera from './Mark';
import TouchableDebounce from 'src/components/TouchableDebounce';
import Icon from 'src/components/Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import {useTheme} from '@react-navigation/native';
import {goBack} from 'src/utilities/helper/navigationHelper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TextView from 'src/components/TextView';
import {AppFont} from 'src/utilities/constants';
import Button from 'src/components/Button';
import {deviceWidth} from 'src/utilities/layout';

const QRScan = ({route}) => {
  const {colors} = useTheme();
  const insest = useSafeAreaInsets();

  const {onScanSuccess} = route.params;

  const styles = makeStyles(colors, insest);

  const [isActive, setActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  // const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
  //   checkInverted: true,
  // });

  // useEffect(() => {
  //   console.log('barcodes', barcodes);
  //   if (barcodes.length !== 0) {
  //     setActive(false);
  //     onScanSuccess && onScanSuccess(barcodes[0].rawValue);
  //     onBack();
  //   }
  // }, [barcodes]);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'authorized');
    if (status === 'authorized') {
      setActive(true);
    }
  };

  const onBack = () => {
    goBack();
  };

  const goSetPermission = () => {
    Linking.openSettings();
  };

  const renderBackButton = () => {
    return (
      <View style={styles.top}>
        <TouchableDebounce onPress={onBack}>
          <Icon source={IconSVG.back} size={20} color={colors.white} />
        </TouchableDebounce>
      </View>
    );
  };

  const renderNoPer = () => {
    if (!hasPermission) {
      return (
        <View style={styles.wrapper}>
          <TextView style={styles.titleStyle} keyLang="plsCheckPer" />
          <Button
            text="Cấp quyền ngay"
            containerStyle={{width: deviceWidth / 2, marginTop: 30}}
            textStyle={{fontSize: AppFont.fontSize.s16}}
            onPress={goSetPermission}
          />
        </View>
      );
    }
    return null;
  };

  const renderCamera = () => {
    if (device !== null && hasPermission) {
      return (
        <>
          {/* <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          /> */}
          <MarkOnCamera />
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderCamera()}
      {renderNoPer()}
      {renderBackButton()}
    </View>
  );
};

export default QRScan;

const makeStyles = (colors, insest) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insest.top,
      paddingBottom: insest.bottom,
      backgroundColor: colors.black,
    },
    top: {
      position: 'absolute',
      left: 20,
      top: insest.top === 0 ? insest.top + 10 : insest.top + 20,
    },
    barcodeTextURL: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
    },
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    titleStyle: {
      fontSize: AppFont.fontSize.s18,
      color: colors.white,
      textAlign: 'center',
    },
  });

import {View, Alert, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {store} from 'src/store';
import RNFetchBlob from 'rn-fetch-blob';
import {isIOS} from 'src/utilities/layout';
import {DOWNLOAD_FILE_URL} from 'src/utilities/constants';
import {t} from 'i18next';
import FileViewer from 'react-native-file-viewer';
import {PERMISSIONS, request} from 'react-native-permissions';
import TouchableDebounce from '../TouchableDebounce';
import CustomIndicator from '../CustomIndicator';
import TextView from '../TextView';
import Icon from '../Icons';
import IconSVG from 'src/assets/icons/IconSVG';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Attachment = ({data}) => {
  const {colors} = useTheme();
  const insest = useSafeAreaInsets();
  const styles = makeStyles(colors, insest);

  const [attachmentList] = useState(data);
  const [isDownloading, setDownloading] = useState(false);
  const [selected, setSelected] = useState(null);

  const checkPerMissionAndroid = () => {
    return new Promise(resolve => {
      request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
        .then(res => {
          if (res !== 'granted') {
            resolve(false);
          }
          return resolve(true);
        })
        .catch(e => resolve(false));
    });
  };

  const showDialog = message => {
    alert(message);
  };

  const downLoadFile = async (url, index) => {
    // console.log('url', `${constant.DOWNLOAD_FILE_URL}/${url}`);
    setDownloading(true);
    setSelected(index);
    const token = store.getState().AuthReducer.accessToken;
    const dirs = RNFetchBlob.fs.dirs;
    if (!isIOS) {
      const hasPermission = await checkPerMissionAndroid();
      if (!hasPermission) {
        return showDialog(t('perReadFile'));
      }
    }
    let aaa = `${DOWNLOAD_FILE_URL}/${url}`;
    aaa = encodeURI(aaa);

    console.log('aaa', aaa);
    RNFetchBlob.config({
      path: `${dirs.DocumentDir}/${url}`,
      overwrite: true,
      fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true,
        mime: 'image/png',
        notification: true,
        description: `Tải xuống ${url}`,
        path: `${dirs.DownloadDir}/${url}`,
      },
    })
      .fetch(isIOS ? 'GET' : 'POST', aaa, {
        Authorization: `bearer ${token}`,
        'Content-Type': 'octet-stream',
      })
      .then(response => {
        console.log('response', response);
        setDownloading(false);
        setSelected(null);

        setTimeout(() => {
          if (!isIOS) {
            Alert.alert(t('dowSuccess'), t('wantDownload'), [
              {text: 'Không'},
              {text: 'Có', onPress: () => openFile(response.path())},
            ]);
          } else {
            openFile(response.path());
          }
        }, 800);
      })
      .catch(e => {
        console.log('e', e);
        setDownloading(false);
        setSelected(null);
        Alert.alert(t('errDownload'), t('errDes'));
      });
  };

  const openFile = path => {
    console.log('path', path);
    FileViewer.open(path, {
      showAppsSuggestions: true,
    }).catch(e => {
      console.log('e openFile', e);
      Alert.alert(t('notSupportFile'));
    });
  };

  return (
    <View style={styles.container}>
      {attachmentList.map((element, index) => (
        <TouchableDebounce
          key={index}
          style={styles.wrapper}
          onPress={() => downLoadFile(element.Url, index)}
          disabled={isDownloading}>
          <View style={styles.btn}>
            {isDownloading && selected === index ? (
              <CustomIndicator />
            ) : (
              <Icon source={IconSVG.download} size={25} />
            )}
          </View>
          <TextView numberOfLines={2} style={styles.txt}>
            {element.Url}
          </TextView>
        </TouchableDebounce>
      ))}
    </View>
  );
};

export default Attachment;

const makeStyles = (colors, insest) =>
  StyleSheet.create({
    container: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      backgroundColor: colors.btnSecondBg,
      paddingBottom: insest.bottom,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      marginRight: 20,
    },
    btn: {
      height: 30,
      width: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    txt: {
      paddingLeft: 15,
      paddingRight: 10,
    },
  });

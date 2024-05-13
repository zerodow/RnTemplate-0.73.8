import moment from 'moment';
import {Platform} from 'react-native';
import {store} from 'src/store';
import {DEVICE_TYPE} from 'src/utilities/constants';

const changeLangSchema = ({userId, languageId}) => ({
  userId,
  languageId,
});

const updateUserInfoSchema = ({
  userId,
  fullName,
  avatar,
  sex,
  birthday,
  cardId,
  email,
}) => ({
  UserId: userId,
  FullName: fullName,
  Avata: avatar,
  Sex: sex,
  Birthday: birthday,
  CardId: cardId,
  Email: email,
  Address: '',
});

const imageLibSchema = ({uri, type}) => {
  const formatFile = uri.split('.').pop();
  const checkFileName = `${Math.floor(Math.random() * 100 + 1)}_${moment(
    new Date(),
  ).format('YYYYMMDDHHmmss')}.${formatFile}`;
  const value = {uri: uri, fileName: checkFileName, type: type};
  return value;
};

const pushTokenSchema = ({token}) => {
  const state = store.getState().AppReducer;
  console.log('state', state);
  const {userId, deviceId} = state;
  return {
    deviceType: Platform.OS === 'ios' ? DEVICE_TYPE.IOS : DEVICE_TYPE.ANDROID,
    deviceId,
    token,
    userId,
  };
};

const deleteTokenSchema = () => {
  const {userId, deviceId} = store.getState().AppReducer;
  return {
    userId,
    deviceType: Platform.OS === 'ios' ? DEVICE_TYPE.IOS : DEVICE_TYPE.ANDROID,
    deviceId,
  };
};

export {
  changeLangSchema,
  updateUserInfoSchema,
  imageLibSchema,
  deleteTokenSchema,
  pushTokenSchema,
};

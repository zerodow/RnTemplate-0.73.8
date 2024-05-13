import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = {
  USER_DATA: 'USER_DATA',
  LOGIN_FIRST_TIME: 'LOGIN_FIRST_TIME',
  REMEMBER_ME: 'REMEMBER_ME',
  LANG: 'LANG',
};

const getLocalData = ({key}) =>
  AsyncStorage.getItem(key).then(data => JSON.parse(data));

const setLocalData = ({data, key}) =>
  AsyncStorage.setItem(key, JSON.stringify(data));

const deleteUserDataFromLocal = key => AsyncStorage.removeItem(key);

const extractUserDataFromDBResponse = (userData = {}, defaultValues) => {
  const {id, email, name, profile_image} = userData;

  return {
    id,
    email,
    name,
    profile_image,
    ...defaultValues,
  };
};

export {
  STORAGE_KEY,
  getLocalData,
  setLocalData,
  deleteUserDataFromLocal,
  extractUserDataFromDBResponse,
};

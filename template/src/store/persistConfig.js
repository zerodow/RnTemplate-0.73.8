import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = ({key, migrate, whitelist, blacklist}) => ({
  key,
  version: 1,
  storage: AsyncStorage,
  timeout: 0,
  migrate,
  whitelist,
  blacklist,
});

export default persistConfig;

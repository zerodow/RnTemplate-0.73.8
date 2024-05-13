import {createSlice} from '@reduxjs/toolkit';
import {APP_LANGUAGE, APP_THEME, NAME_REDUCER} from '../../utilities/constants';

const slice = createSlice({
  name: NAME_REDUCER.APP,
  initialState: {
    appTheme: APP_THEME.LIGHT,
    language: APP_LANGUAGE.VI,
    deviceId: null,
    androidApiLevel: null,
    langVersion: 0,
  },
  reducers: {
    changeThemeAction: (state, {payload: {theme}}) => {
      state.appTheme = theme;
    },
    changeLangAction: (state, {payload: {lang}}) => {
      state.language = lang;
    },
    setDeviceIdAction: (state, {payload: {deviceId}}) => {
      state.deviceId = deviceId;
    },
    setAndroidApiLevelAction: (state, {payload: {androidApiLevel}}) => {
      state.androidApiLevel = androidApiLevel;
    },
    setLangVersionAction: (state, {payload: {langVersion}}) => {
      state.langVersion = langVersion;
    },
  },
});

export const {
  changeTheme,
  changeLangAction,
  setDeviceIdAction,
  setAndroidApiLevelAction,
  setLangVersionAction,
} = slice.actions;

export default slice.reducer;

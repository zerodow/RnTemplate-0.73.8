import {createSlice} from '@reduxjs/toolkit';
import {NAME_REDUCER} from '../../utilities/constants';

const slice = createSlice({
  name: NAME_REDUCER.AUTH,
  initialState: {
    projectId: 1,
    towerId: 1,
    phoneNumber: null,
    userId: null,
    userInfo: {
      projectId: 1,
      towerId: 1,
      zoneId: 1,
    },
    accessToken: null,
  },
  reducers: {
    setUserInfo: (state, {payload: {data}}) => {
      state.type = data.type;
      state.userInfo = data;
      state.userId = data.userId;
      state.projectId = data.projectId;
      state.towerId = data.towerId;
      state.phoneNumber = data.phone;
    },
    clearUserInfo: state => {
      state.userInfo = null;
    },
    setAccessToken: (state, {payload: {token}}) => {
      state.accessToken = token;
    },
    clearAccessToken: state => {
      state.accessToken = null;
    },
    logoutAction: state => {
      state.accessToken = null;
      state.userInfo = null;
    },
  },
});

export const {
  setUserInfo,
  clearUserInfo,
  setAccessToken,
  clearAccessToken,
  logoutAction,
} = slice.actions;

export default slice.reducer;

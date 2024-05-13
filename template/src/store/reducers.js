import {combineReducers} from 'redux';
import AppReducer from './app';
import AuthReducer from './auth';

export const rootReducer = combineReducers({
  AppReducer,
  AuthReducer,
});

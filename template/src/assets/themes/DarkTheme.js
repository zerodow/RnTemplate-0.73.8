import {DarkTheme} from '@react-navigation/native';

export default {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    background: 'black',
    white: '#ffffff',
    black: '#000000',
    btn1: 'red',
    btn2: 'green',
    homeIcon: '#2D4CAF',
    activeTab: '#34A853',
    unActiveTab: '#6E7583',
  },
};

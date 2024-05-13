import {StyleSheet} from 'react-native';

const AppColors = {
  transparent: 'transparent',

  white: '#FFFFFF',

  icon: '#757575',

  textPrimary: '#6E7583',

  neutral3: '#454D5B',

  secondary: '#233f82',

  red: '#FF0000',

  greenLow: '#D3F1ED',

  green: '#34A853',

  neutral2: '#555555',
};

const AppStyles = StyleSheet.create({
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  shadow2: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  shadow3: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

const AppFont = {
  fontSize: {
    s10: 10,
    s11: 11,
    s12: 12,
    s13: 13,
    s14: 14,
    s16: 16,
    s17: 17,
    s18: 18,
    s20: 20,
    s24: 24,
    s28: 28,
    s34: 34,
    s40: 40,
    s50: 50,
    s57: 57,
  },
  fontFamily: {
    regular: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semiBold: 'Montserrat-SemiBold',
  },
  fontWeight: {
    normal: '300',
    regular: '400',
    bold: '600',
    superBold: '700',
  },
  light: 'light',
  dark: 'dark',
};

export {AppStyles, AppColors, AppFont};

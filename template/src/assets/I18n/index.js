import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {APP_LANGUAGE} from '../../utilities/constants';
import en from './resources/en.json';
import vi from './resources/vi.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    vi: {
      translation: vi,
    },
  },
  lng: APP_LANGUAGE.VI,
  fallbackLng: APP_LANGUAGE.VI,
  ns: ['translation'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  compatibilityJSON: 'v3',
});

export default i18n;

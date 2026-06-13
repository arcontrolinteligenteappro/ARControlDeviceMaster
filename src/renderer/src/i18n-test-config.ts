import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  // Un espacio de nombres de ejemplo
  ns: ['common'],
  defaultNS: 'common',

  resources: {
    en: {
      common: {},
    },
  },

  // Desactiva la salida de la consola para las pruebas
  debug: false,

  interpolation: {
    escapeValue: false, // no es necesario para React
  },
});

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa tus ficheros de traducción
import en from './locales/en.json';
import es from './locales/es.json';

i18n
  // Detecta el idioma del navegador del usuario
  .use(LanguageDetector)
  // Pasa la instancia de i18n a react-i18next.
  .use(initReactI18next)
  // Configuración de i18n
  .init({
    // Definimos los recursos (traducciones)
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    // Idioma de reserva si el idioma detectado no está disponible
    fallbackLng: 'es',
    interpolation: {
      // React ya protege contra XSS, por lo que podemos desactivar esto
      escapeValue: false,
    },
    // Configuración para el detector de idioma
    detection: {
      // Orden de detección: primero busca en el LocalStorage, luego en el navegador.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

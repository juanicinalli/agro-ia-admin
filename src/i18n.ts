import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationIT from './locales/it/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  it: {
    translation: translationIT
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language if detected or selected is not available
    debug: process.env.NODE_ENV === 'development', // Enable debug mode in development

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'], // Cache the language in localStorage
    }
  });

export default i18n;

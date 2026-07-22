import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import pt from './pt.json'
import en from './en.json'
import es from './es.json'

const resources = { pt: { translation: pt }, en: { translation: en }, es: { translation: es } }

const detectionOrder: Array<'localStorage' | 'navigator'> = ['localStorage', 'navigator']

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['pt', 'en', 'es'],
    interpolation: { escapeValue: false },
    detection: {
      order: detectionOrder,
      caches: ['localStorage'],
      lookupLocalStorage: 'i18n_lang',
    },
  })

export default i18n

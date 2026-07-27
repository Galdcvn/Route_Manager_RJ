import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const bundles: Record<string, () => Promise<{ default: object }>> = {
  pt: () => import('./pt.json'),
  en: () => import('./en.json'),
  es: () => import('./es.json'),
}

async function loadBundle(lng: string) {
  const key = lng.split('-')[0]
  const loader = bundles[key]
  if (!loader) return
  if (i18n.hasResourceBundle(key, 'translation')) return
  const mod = await loader()
  i18n.addResourceBundle(key, 'translation', mod.default, true, true)
}

const detectionOrder: Array<'localStorage' | 'navigator'> = ['localStorage', 'navigator']

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['pt', 'en', 'es'],
    interpolation: { escapeValue: false },
    detection: {
      order: detectionOrder,
      caches: ['localStorage'],
      lookupLocalStorage: 'i18n_lang',
    },
  })

loadBundle(i18n.language)

i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng)
  loadBundle(lng)
})

export default i18n

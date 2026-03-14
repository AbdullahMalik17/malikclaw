import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/ur"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import ur from "./locales/ur.json"

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        translation: en,
      },
      ur: {
        translation: ur,
      },
    },
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

i18n.on("languageChanged", (lng) => {
  if (lng === "ur") {
    dayjs.locale("ur")
    document.documentElement.dir = "rtl"
    document.documentElement.lang = "ur"
  } else {
    dayjs.locale("en")
    document.documentElement.dir = "ltr"
    document.documentElement.lang = "en"
  }
})

// Set initial direction
if (i18n.language === "ur") {
  document.documentElement.dir = "rtl"
  document.documentElement.lang = "ur"
} else {
  document.documentElement.dir = "ltr"
  document.documentElement.lang = "en"
}

export default i18n

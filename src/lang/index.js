import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhTWLocale from 'element-ui/lib/locale/lang/zh-TW' // element-ui lang
import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import enLocale from './en-US'
import zhHKLocal from './zh-HK'
import zhCNLocal from './zh-CN'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  hk: {
    ...zhHKLocal,
    ...elementZhTWLocale
  },
  cn: {
    ...zhCNLocal,
    ...elementZhCNLocale
  }
}
export function getLanguage() {
  // console.log(navigator.language.toLowerCase())
  // const language = navigator.language.toLowerCase()
  // // console.log(135135)
  // // console.log(language)
  // const locales = Object.keys(messages)
  // for (const locale of locales) {
  //   if (language.indexOf(locale) > -1) {
  //     return locale
  //   }
  // }
  return 'en'
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})

export default i18n

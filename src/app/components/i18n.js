import { createI18n } from 'vue-i18n'

import ru from '@/app/locales/ru'
import en from '@/app/locales/en'
import jp from '@/app/locales/jp'
import pt from '@/app/locales/pt'


const customRule = (choice, choicesLength, orgRule) => {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

const i18n = createI18n({
  //legacy: false,
  locale: process.env.VUE_APP_I18N_LOCALE || 'ru',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ru',
  messages: { ru, en, jp, pt },
  pluralizationRules: {
    ru: customRule
  }
})

export default i18n
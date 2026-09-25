import { useI18n } from 'vue-i18n'
import { humanizeError } from '@/app/services/utilities'

interface HumanizedError {
  icon: string
  title: string
  description: string
  payload?: string
}

export function useHumanizeError() {
  const { t } = useI18n()

  return (error: unknown): HumanizedError => {
    const { icon, title, description, payload } = humanizeError(error)
    return {
      icon:  t(icon),
      // для internal-ошибок description — это не i18n-ключ, не прогоняем через t()
      title: t(title),
      description: description.startsWith('errors.') ? t(description) : description,
      payload
    }
  }
}
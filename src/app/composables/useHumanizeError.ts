import { useI18n } from 'vue-i18n'
import { humanizeError } from '@/app/services/utilities'

interface HumanizedError {
  icon: string
  title: string
  description: string
}

export function useHumanizeError() {
  const { t } = useI18n()

  return (error: unknown): HumanizedError => {
    const { icon, title, description } = humanizeError(error)
    return {
      icon:        t(icon),
      title:       t(title),
      description: t(description)
    }
  }
}
/**
 * Приводим работу со временем в порядок
 *
 * @author Боженька <god@heaven>
 * @version 1.0.0
 */
import { useI18n } from 'vue-i18n'
import { timeAgo, fullDate } from '@/app/services/datetime.js'
import { ref, onMounted, onUnmounted } from 'vue'

export function useTimeAgo() {
  const { t, locale } = useI18n()
  const tick = ref(0)
  let interval = null

  onMounted(() => {
    interval = setInterval(() => tick.value++, 30000)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })

  const translate = ([key, args]) => {
    return args?.n !== undefined
      ? t(key, args.n, args)
      : t(key, args)
  }

  return {
    timeAgo: (timestamp) => {
      tick.value // подписываемся на tick чтобы computed реагировал
      return translate(timeAgo(timestamp, locale.value))
    },
    fullDate: (timestamp) => translate(fullDate(timestamp, locale.value))
  }
}
import { createPinia } from 'pinia'
import api from '@/app/services/api'

const pinia = createPinia()

// Добавляем $api в каждый стор
pinia.use(({ store }) => {
  store.$api = api
})

export default pinia
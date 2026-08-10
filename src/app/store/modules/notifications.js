import { extendStore, createListStore } from '@/app/store/factory'
import { to } from '@/app/services/utilities'

const initialFilters = { tab: '', offset: 0 }

const useBase = createListStore('notifications', 'my/notifications', initialFilters)

export const useNotificationsStore = extendStore(useBase, (store) => ({
  loadNew() {
    console.log('new notify')
  },

  async readAll() {
    const [error, result] = await to(
      this.$api.post('my/notifications/read', { mode: 'all' })
    )
    if (error) throw error
  
    store.data.forEach(item => item.state.is_readed = true)
    return result
  },
  
  async seen() {
    const [error, result] = await to(
      this.$api.post('my/notifications/seen')
    )
    if (error) throw error

    return result
  },
  
  async read(notifyId) {
    const item = store.data.find(n => n.notify_id === notifyId)
    if (!item || item.state.is_readed) return
  
    // Оптимистично помечаем как прочитанный
    item.state.is_readed = true
  
    const [error, result] = await to(
      this.$api.post(`my/notifications/${notifyId}/read`)
    )
    if (error) {
      // Возвращаем при ошибке
      item.state.is_readed = false
      throw error
    }
    return result
  },

  async hide(notifyId) {
    const index = store.data.findIndex(n => n.notify_id === notifyId)
    if (index === -1) return
  
    // Оптимистично убираем элемент сразу, но сохраняем и сам элемент,
    // и его индекс — понадобятся для отката, если запрос упадёт
    const [item] = store.data.splice(index, 1)
  
    const [error, result] = await to(
      this.$api.post(`my/notifications/${notifyId}/hide`)
    )
    if (error) {
      // Возвращаем элемент точно на прежнюю позицию, а не в конец/начало
      store.data.splice(index, 0, item)
      throw error
    }
  
    return result
  }
}))
import { extendStore, createListStore } from '@/app/store/factory'
import { to } from '@/app/services/utilities'

const useBase = createListStore('logins', 'settings/logins', { offset: 0 })

export const useLoginsStore = extendStore(useBase, (store) => ({
  async revokeSession(loginId) {
    const [error] = await to(
      this.$api.delete(`settings/logins/${loginId}`)
    )
    if (error) throw error
  
    store.data = store.data.filter(item => item.login_id !== loginId)
    store.hasMore -= 1
    return null
  }
}))
import { extendStore, createListStore } from '@/app/store/factory'
import { to } from '@/app/services/utilities'

const useBase = createListStore('logins', 'my/drafts', { offset: 0 })

export const useEntryDraftsStore = extendStore(useBase, (store) => ({
  async save({ state, commit }, payload) {
    const currentId = state.filters.currentId
    const endpoint = currentId ? `my/drafts/${currentId}` : 'my/drafts'
    const method = currentId ? 'patch' : 'post'
  
    const result = await this.$api[method](endpoint, payload)
  
    // Запоминаем id после первого создания
    if (!currentId) {
      commit('SET_FILTERS', { ...state.filters, currentId: result.payload.id })
    }
  
    return result.payload
  },

  async discard() {
    const currentId = state.filters.currentId
    if (!currentId) return
  
    await this.$api.delete(`my/drafts/${currentId}`)
    commit('SET_FILTERS', { ...state.filters, currentId: null })
  },

  deleteAll({ dispatch }) {
    dispatch('clear')
    return this.$api.delete('my/drafts')
  }
}))
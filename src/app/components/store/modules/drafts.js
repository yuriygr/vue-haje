import { createListedModule } from '@/app/components/store/factory'

const draftsModule = createListedModule('my/drafts')

export default {
  ...draftsModule,
  actions: {
    ...draftsModule.actions,

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

    load({ commit }, id) {
      return this.$api.get(`my/drafts/${id}`)
    },

    remove({ dispatch }, id) {
      return this.$api.delete(`my/drafts/${id}`)
    },

    async discard({ state, commit }) {
      const currentId = state.filters.currentId
      if (!currentId) return
    
      await this.$api.delete(`my/drafts/${currentId}`)
      commit('SET_FILTERS', { ...state.filters, currentId: null })
    },

    deleteAll({ dispatch }) {
      dispatch('clear')
      return this.$api.delete('my/drafts')
    }
  }
}
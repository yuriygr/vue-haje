import { createListedModule } from '@/app/components/store/module'

export default {
  namespaced: true,
  modules: {
    entries: createListedModule((
      (rootState) => `tag/${rootState.tag.data.slug}/entries`
    ))
  },
  state() {
    return {
      data: {},

      loading: false,
      error: false
    }
  },
  mutations: {
    'SET_DATA'(state, payload) {
      state.data = payload
    },
    'CLEAR_DATA'(state) {
      state.data = {}
    },
    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      state.error = payload
    }
  },
  actions: {
    fetch({ commit }, slug = '') {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`tag/${slug}`)
      .then(result => {
        commit('SET_DATA', result)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    clear({ commit, dispatch }) {
      commit('CLEAR_DATA')
    }
  },
  getters: {}
}
import { createListedModule } from '@/app/components/store/module'

export default {
  namespaced: true,
  modules: {
    entries: createListedModule(
      (rootState) => `user/${rootState.user.data.username}/entries`
    ),
    subscribers: createListedModule(
      (rootState) => `user/${rootState.user.data.username}/subscribers`
    ),
    subscriptions: createListedModule(
      (rootState) => `user/${rootState.user.data.username}/subscriptions`
    ),
    badges: createListedModule(
      (rootState) => `user/${rootState.user.data.username}/badges`
    )
  },
  state() {
    return {
      data: {},

      controller: false,
      loading: false,
      error: false
    }
  },
  mutations: {
    SET_DATA: (state, payload) => state.data = payload,
    CLEAR_DATA: (state) => state.data = {},
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ERROR: (state, payload) => state.error = payload,
    ADD_CONTROLLER: (state, payload) => state.controller = payload,
    REMOVE_CONTROLLER: (state) => state.controller = false
  },
  actions: {
    fetch({ commit }, user_id = 0) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      const controller = new AbortController()
      commit('ADD_CONTROLLER', controller)

      this.$api.get(`user/${user_id}`, false, controller.signal)
      .then(result => {
        commit('SET_DATA', result)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => {
        commit('REMOVE_CONTROLLER')
        commit('SET_LOADING', false)
      })
    },
    clear({ commit, state }) {
      if (state.controller)
        state.controller.abort()
      commit('REMOVE_CONTROLLER')
      commit('CLEAR_DATA')
    }
  },
  getters: { }
}
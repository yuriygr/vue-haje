export default {
  namespaced: true,
  state() {
    return {
      data: {
        is_auth: false,
        user: {
          state: {
            has_new_notifications: 0
          }
        }
      },

      loading: false,
      error: false
    }
  },
  mutations: {
    'SET_DATA'(state, payload) {
      state.data = payload
    },
    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      state.error = payload
    },
    'NOTIFICATIONS_SEEN'(state) {
      state.data.user.state.has_new_notifications = 0
    }
  },
  actions: {
    init({ state, commit }) {
      commit('SET_DATA', JSON.parse(localStorage.getItem('auth')) || state.data)
    },
    fetch({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get('auth/session')
      .then(result => {
        commit('SET_DATA', result)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    set({ commit }, payload) {
      commit('SET_DATA', payload)
    },
    seen_notifications({ state, commit }) {
      let result = { ...state.data }
      result.user.state.has_new_notifications = 0
      commit('SET_DATA', result)
    },
    has_notice({ state, commit }, payload) {
      let result = { ...state.data }
      result.user.state.has_new_notifications = payload
      commit('SET_DATA', result)
    }
  },
  getters: {
    isAuth(state) {
      return state.data.is_auth
    },
    hasNewNotifications(state) {
      return state.data.user
        ? state.data.user.state.has_new_notifications
        : false
    }
  }
}
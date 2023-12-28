export default {
  namespaced: true,
  state() {
    return {
      data: [],
      sorting: {
        list: [ 'entries', 'comments' ],
        active: 'entries'
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
    }
  },
  actions: {
    fetch({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get('my/bookmarks')
      .then(result => {
        commit('SET_DATA', result)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    }
  },
  getters: {

  }
}
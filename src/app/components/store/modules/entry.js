let comments = {
  namespaced: true,
  state() {
    return {
      data: [],

      loading: false,
      error: false
    }
  },
  mutations: {
    'SET_DATA'(state, payload) {
      state.data = payload
    },
    'CLEAR_DATA'(state) {
      state.data = []
    },
    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      state.error = payload
    }
  },
  actions: {
    fetch({ commit }, uuid = 'nope') {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`entry/${uuid}/comments`)
      .then(result => {
        commit('SET_DATA', result)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
    }
  },
  getters: {
    tree(state) {
      const hash_map = Object.create(null)
      state.data.forEach(item => hash_map[item.comment_id] = { ...item, replies: [] })

      const data_tree = []
      state.data.forEach(item => {
        if (item.parent_id)
          hash_map[item.parent_id].replies.push(hash_map[item.comment_id])
        else
          data_tree.push(hash_map[item.comment_id])
      })
      return data_tree
    }
  }
}

export default {
  namespaced: true,
  modules: { comments },
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
    fetch({ commit }, uuid = 'nope') {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`entry/${uuid}`)
      .then(result => {
        commit('SET_DATA', result)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
    }
  },
  getters: { }
}
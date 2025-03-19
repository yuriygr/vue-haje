let comments = {
  namespaced: true,
  state() {
    return {
      data: [],

      filters: { },

      loading: false,
      error: false
    }
  },
  mutations: {
    // DATA
    'SET_DATA'(state, payload) {
      state.data = payload
    },
    'ADD_DATA'(state, payload) {
      state.data = [...state.data, ...payload]
    },
    'CLEAR_DATA'(state) {
      state.data = []
    },
    // FILTEST
    'SET_FILTERS'(state, payload) {
      state.filters = payload
    },
    'CLEAR_FILTERS'(state) {
      state.filters = {}
    },
    // OTHER
    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      state.error = payload
    }
  },
  actions: {
    fetch({ commit, state }, { initial = true, uuid  = 'nope' }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      return this.$api.get(`entry/${uuid}/comments`, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
    },
    add({ commit }, payload) {
      commit('ADD_DATA', [payload])
    },
    async more({ state, commit, dispatch }, { uuid  = 'nope' }) {
      let last_id = (state.data.length > 0) ? state.data[state.data.length - 1].comment_id : 0
      await commit('SET_FILTERS', { ...state.filters, last_id: last_id })

      return dispatch('fetch', { initial: false, uuid })
    },
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

let history = {
  namespaced: true,
  state() {
    return {
      data: [],
      total_items: 0,

      filters: { },

      loading: false,
      error: false
    }
  },
  mutations: {
    // DATA
    'SET_DATA'(state, payload) {
      state.data = payload
    },
    'ADD_DATA'(state, payload) {
      state.data = [...state.data, ...payload]
    },
    'SET_TOTAL_ITEMS'(state, payload) {
      state.total_items = payload
    },
    'CLEAR_DATA'(state) {
      state.data = []
    },
    // FILTEST
    'SET_FILTERS'(state, payload) {
      state.filters = payload
    },
    'CLEAR_FILTERS'(state) {
      state.filters = {}
    },
    // OTHER
    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      state.error = payload
    }
  },
  actions: {
    fetch({ commit, state }, { initial = true, uuid = '' }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      return this.$api.get(`entry/${uuid}/history`, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_TOTAL_ITEMS', 0)
    },
    async more({ state, commit, dispatch }, uuid = '') {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', { initial: false, uuid })
    },
  },
  getters: {
    hasMoreItems(state) {
      return state.data.length < state.total_items
    }
  }
}

export default {
  namespaced: true,
  modules: { comments, history },
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
    pre_fetch({ commit }, payload) {
      commit('SET_DATA', payload)
    },
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
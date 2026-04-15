let history = {
  namespaced: true,
  state() {
    return {
      data: [],
      hasMore: false,

      filters: { },

      controller: false,
      loading: false,
      error: false
    }
  },
  mutations: {
    SET_DATA: (state, payload) => state.data = payload,
    ADD_DATA: (state, payload) => state.data.push(...payload),
    SET_HAS_MORE: (state, payload) => state.hasMore = payload,
    CLEAR_DATA: (state) => {
      state.data = []
      state.hasMore = false
    },
    SET_FILTERS: (state, payload) => state.filters = { ...payload },
    CLEAR_FILTERS: (state) => state.filters = { ...initialFilters },
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ERROR: (state, payload) => state.error = payload,
    ADD_CONTROLLER: (state, payload) => state.controller = payload,
    REMOVE_CONTROLLER: (state) => state.controller = false
  },
  actions: {
    fetch({ commit, state }, { initial = true, id = '' }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      const controller = new AbortController()
      commit('ADD_CONTROLLER', controller)

      this.$api.get(`comment/${id}/history`, state.filters, controller.signal)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_HAS_MORE', result.has_more)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => {
        commit('REMOVE_CONTROLLER')
        commit('SET_LOADING', false)
      })
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_HAS_MORE', false)
    },
    async more({ state, commit, dispatch }, id = '') {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', { initial: false, id })
    },
  },
  getters: {
    hasMoreItems: state => state.hasMore,
  }
}

export default {
  namespaced: true,
  modules: { history },
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
    fetch({ commit }, id = 'nope') {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`comment/${id}`)
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
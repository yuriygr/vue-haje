let feeds =  {
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
      state.filters = { }
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
    fetch({ state, commit }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get('feed/feeds', state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    async refresh({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: 0 })
      dispatch('fetch')
    },
    async more({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', false)
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_TOTAL_ITEMS', 0)
    },
    // Filters
    setFilters({ state, commit }, payload) {
      commit('SET_FILTERS', { ...state.filters, ...payload })
    },
    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    }
  },
  getters: {
    hasMoreItems(state) {
      return state.data.length < state.total_items
    }
  }
}

export default {
  namespaced: true,
  modules: { feeds },
  state() {
    return {
      data: [],
      total_items: 0,
      
      tab: 'timeline',
      filters: {
        limit: 7
      },

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
    // TAB
    'SET_TAB'(state, payload) {
      state.tab = payload
    },
    'CLEAR_TAB'(state) {
      state.tab = ''
    },
    // FILTERS
    'SET_FILTERS'(state, payload) {
      state.filters = payload
    },
    'CLEAR_FILTERS'(state) {
      state.filters = {
        limit: 7
      }
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
    fetch({ state, commit }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`feed/${state.tab}`, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    async refresh({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: 0 })
      dispatch('fetch')
    },
    async more({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', false)
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_TAB')
      commit('CLEAR_FILTERS')
      commit('SET_TOTAL_ITEMS', 0)
    },
    // Tab
    setTab({ commit }, payload) {
      commit('SET_TAB', payload)
    },
    clearTab({ commit }) {
      commit('CLEAR_TAB')
    },
    // Filters
    setFilters({ state, commit }, payload) {
      commit('SET_FILTERS', { ...state.filters, ...payload })
    },
    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    }
  },
  getters: {
    hasMoreItems(state) {
      return state.data.length < state.total_items
    }
  }
}
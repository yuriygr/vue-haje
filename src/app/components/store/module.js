const createListedModule = (endpointBuilder = '', initialFilters = {}) => ({
  namespaced: true,
  state: () => ({
    data: [],
    total_items: 0,
    filters: { ...initialFilters },
    loading: false,
    error: null
  }),
  mutations: {
    SET_DATA: (state, payload) => state.data = payload,
    ADD_DATA: (state, payload) => state.data.push(...payload),
    SET_TOTAL_ITEMS: (state, payload) => state.total_items = payload,
    CLEAR_DATA: (state) => {
      state.data = []
      state.total_items = 0
    },
    SET_FILTERS: (state, payload) => state.filters = payload,
    CLEAR_FILTERS: (state) => state.filters = { ...initialFilters },
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ERROR: (state, payload) => state.error = payload
  },
  actions: {
    fetch({ state, commit, rootState }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      // Какой же костыль...
      const endpoint =  (typeof endpointBuilder == 'function')
        ? endpointBuilder(rootState)
        : endpointBuilder


      return this.$api.get(endpoint, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
      
    },

    async refresh({ dispatch, commit }) {
      commit('SET_FILTERS', { offset: 0 })
      await dispatch('fetch', true)
    },

    async more({ state, dispatch, commit }) {
      commit('SET_FILTERS', { offset: state.data.length })
      await dispatch('fetch', false)
    },

    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
    },

    setFilters({ commit }, payload) {
      commit('SET_FILTERS', payload)
    }
  },
  getters: {
    hasMoreItems: state => state.data.length < state.total_items
  }
})

const createSearchModule = (endpoint, initialFilters = { query: '' }) => ({
  namespaced: true,
  state: () => ({
    data: [],
    total_items: 0,
    filters: { ...initialFilters },
    loading: false,
    error: null
  }),
  mutations: {
    SET_DATA: (state, payload) => state.data = payload,
    ADD_DATA: (state, payload) => state.data.push(...payload),
    SET_TOTAL_ITEMS: (state, payload) => state.total_items = payload,
    CLEAR_DATA: (state) => {
      state.data = []
      state.total_items = 0
    },
    SET_FILTERS: (state, payload) => state.filters = { ...payload },
    CLEAR_FILTERS: (state) => state.filters = { ...initialFilters },
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ERROR: (state, payload) => state.error = payload
  },
  actions: {
    fetch({ state, commit }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      return this.$api.get(endpoint, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    async refresh({ commit, dispatch }) {
      await commit('SET_FILTERS', { ...initialFilters, offset: 0 })
      dispatch('fetch', true)
    },
    async more({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { 
        ...state.filters, 
        offset: state.data.length 
      })
      dispatch('fetch', false)
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
    },
    setFilters({ commit }, payload) {
      commit('SET_FILTERS', payload)
    }
  },
  getters: {
    hasFilters: () => true,
    hasMoreItems: state => state.data.length < state.total_items,
    emptyQuery: state => state.filters.query === '',
    searching: state => state.filters.query !== ''
  }
})

export { createListedModule, createSearchModule }
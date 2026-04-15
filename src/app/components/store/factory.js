const createListedModule = (endpointBuilder = '', initialFilters = {}, ignoredFilterKeys = ['offset']) => ({
  namespaced: true,
  state: () => ({
    data: [],
    hasMore: false,

    filters: { ...initialFilters },

    controller: false,
    loading: false,
    error: null
  }),
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
    fetch({ state, commit, rootState }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const endpoint =  (typeof endpointBuilder == 'function')
        ? endpointBuilder(rootState)
        : endpointBuilder

      const controller = new AbortController()
      commit('ADD_CONTROLLER', controller)

      return this.$api.get(endpoint, state.filters, controller.signal)
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

    async refresh({ dispatch, commit }) {
      await commit('SET_FILTERS', { offset: 0 })
      dispatch('fetch', true)
    },

    async more({ state, dispatch, commit }) {
      await commit('SET_FILTERS', { offset: state.data.length })
      dispatch('fetch', false)
    },

    clear({ commit, state }) {
      if (state.controller)
        state.controller.abort()
      commit('REMOVE_CONTROLLER')
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_LOADING', false)
      commit('SET_ERROR', false)
    },

    setFilters({ commit }, payload) {
      commit('SET_FILTERS', payload)
    },
    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    }
  },
  getters: {
    hasMoreItems: state => state.hasMore,
    hasFilters: (state) => {
      return Object.entries(state.filters).some(([key, value]) => {
        // Пропускаем служебные ключи
        if (ignoredFilterKeys.includes(key)) return false

        // Сравниваем с начальным значением
        const initialValue = initialFilters[key]

        // Массив — проверяем что не пустой и отличается от initial
        if (Array.isArray(value)) {
          return value.length > 0 && 
            JSON.stringify(value) !== JSON.stringify(initialValue ?? [])
        }

        // Остальные значения — сравниваем с initial
        return value !== undefined &&
          value !== null &&
          value !== '' &&
          value !== initialValue
      })
    }
  }
})

const createItemModule = (endpointBuilder) => ({
  namespaced: true,
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
    pre_fetch({ commit }, payload) {
      commit('SET_DATA', payload)
    },
    fetch({ commit }, prop = '') {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      const controller = new AbortController()
      commit('ADD_CONTROLLER', controller)

      const endpoint = typeof endpointBuilder === 'function'
        ? endpointBuilder(prop)
        : `${endpointBuilder}/${prop}`

      this.$api.get(endpoint, false, controller.signal)
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
    clear({ state, commit }) {
      if (state.controller)
        state.controller.abort()
      commit('REMOVE_CONTROLLER')
      commit('CLEAR_DATA')
    }
  },
  getters: {
    isEmpty: state => Object.keys(state.data).length === 0
  }
})

const createSearchModule = (endpoint, initialFilters = { query: '' }, ignoredFilterKeys = ['offset']) => ({
  namespaced: true,
  state: () => ({
    data: [],
    hasMore: false,

    filters: { ...initialFilters },

    controller: false,
    loading: false,
    error: null
  }),
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
    fetch({ state, commit }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      const controller = new AbortController()
      commit('ADD_CONTROLLER', controller)

      return this.$api.get(endpoint, state.filters, controller.signal)
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
    clear({ commit, state }) {
      if (state.controller)
        state.controller.abort()
      commit('REMOVE_CONTROLLER')
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_LOADING', false)
      commit('SET_ERROR', false)
    },
    
    setFilters({ commit }, payload) {
      commit('SET_FILTERS', payload)
    },
    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    }
  },
  getters: {
    hasFilters: (state) => {
      return Object.entries(state.filters).some(([key, value]) => {
        // Пропускаем служебные ключи
        if (ignoredFilterKeys.includes(key)) return false

        // Сравниваем с начальным значением
        const initialValue = initialFilters[key]

        // Массив — проверяем что не пустой и отличается от initial
        if (Array.isArray(value)) {
          return value.length > 0 && 
            JSON.stringify(value) !== JSON.stringify(initialValue ?? [])
        }

        // Остальные значения — сравниваем с initial
        return value !== undefined &&
          value !== null &&
          value !== '' &&
          value !== initialValue
      })
    },
    hasMoreItems: state => state.hasMore,
    emptyQuery: state => state.filters.query === '',
    searching: state => state.filters.query !== ''
  }
})

export { createListedModule, createItemModule, createSearchModule }
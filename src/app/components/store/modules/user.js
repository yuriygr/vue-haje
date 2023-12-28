let entries = {
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
    fetch({ state, commit, rootState }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`user/${rootState.user.data.username}/entries`, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    async more({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', false)
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_TOTAL_ITEMS', 0)
    }
  },
  getters: {
    hasMoreItems(state) {
      return state.data.length < state.total_items
    }
  }
}

let subscribers = {
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
    fetch({ state, commit, rootState }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`user/${rootState.user.data.username}/subscribers`, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    async more({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', false)
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_TOTAL_ITEMS', 0)
    }
  },
  getters: {
    hasMoreItems(state) {
      return state.data.length < state.total_items
    }
  }
}

let subscriptions = {
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
    fetch({ state, commit, rootState }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`user/${rootState.user.data.username}/subscriptions`, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    async more({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', false)
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_TOTAL_ITEMS', 0)
    }
  },
  getters: {
    hasMoreItems(state) {
      return state.data.length < state.total_items
    }
  }
}

let badges = {
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
    fetch({ state, commit, rootState }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`user/${rootState.user.data.username}/badges`, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    async more({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', false)
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_TOTAL_ITEMS', 0)
    }
  },
  getters: {
    hasMoreItems(state) {
      return state.data.length < state.total_items
    }
  }
}

let tags = {
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
    fetch({ state, commit, rootState }, initial = true) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`user/${rootState.user.data.username}/tags`, state.filters)
      .then(result => {
        commit(initial ? 'SET_DATA' : 'ADD_DATA', result.items)
        commit('SET_TOTAL_ITEMS', result.total_items)
      })
      .catch(error => {
        commit('SET_ERROR', error)
      })
      .then(_ => commit('SET_LOADING', false))
    },
    async more({ state, commit, dispatch }) {
      await commit('SET_FILTERS', { ...state.filters, offset: state.data.length })
      dispatch('fetch', false)
    },
    clear({ commit }) {
      commit('CLEAR_DATA')
      commit('CLEAR_FILTERS')
      commit('SET_TOTAL_ITEMS', 0)
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
  modules: { entries, subscribers, subscriptions, badges, tags },
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
    fetch({ commit }, user_id = 0) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get(`user/${user_id}`)
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
      //dispatch('user/entries/clear', null, { root: true })
      //dispatch('user/subscribers/clear', null, { root: true })
      //dispatch('user/subscriptions/clear', null, { root: true })
      //dispatch('user/badges/clear', null, { root: true })
      //dispatch('user/tags/clear', null, { root: true })
    }
  },
  getters: {
    getUserLink(state) {
      return (code) => {
        return state.data.links?.filter(l => l.code == code)[0].url || false
      }
    }
  }
}
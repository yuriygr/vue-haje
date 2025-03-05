import { createListedModule } from '@/app/components/store/module'

let all = {
  namespaced: true,
  state() {
    return {
      data: {
        users: [],
        entries: [],
        feeds: []
      },

      filters: {},

      loading: false,
      error: false
    }
  },
  mutations: {
    SET_DATA: (state, payload) => state.data = payload,
    CLEAR_DATA: (state) => {
      state.data = {
        users: [],
        entries: [],
        feeds: []
      }
    },
    SET_FILTERS: (state, payload) => state.filters = payload,
    CLEAR_FILTERS: (state) => state.filters = { },
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ERROR: (state, payload) => state.error = payload
  },
  actions: {
    fetch({ state, commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get('my/bookmarks/all', state.filters)
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
      commit('CLEAR_FILTERS')
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
    emptyData(state) {
      return (
        state.data.entries.length + state.data.users.length + state.data.feeds.length
      ) == 0
    }
  }
}

export default {
  namespaced: true,
  modules: {
    all: all,
    users: createListedModule('my/bookmarks/users'),
    entries: createListedModule('my/bookmarks/entries'),
    feeds: createListedModule('my/bookmarks/feeds')
  }
}
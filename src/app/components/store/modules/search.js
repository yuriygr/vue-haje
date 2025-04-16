import { createSearchModule } from '@/app/components/store/module'

let all = {
  namespaced: true,
  state() {
    return {
      data: {
        users: [],
        entries: [],
        comments: [],
        tags: [],
        feeds: []
      },
      filters: {
        query: ''
      },
      
      controller: false,
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
        comments: [],
        tags: [],
        feeds: []
      }
    },
    SET_FILTERS: (state, payload) => state.filters = { ...payload },
    CLEAR_FILTERS: (state) => state.filters = { query: '' },
    SET_LOADING: (state, payload) => state.loading = payload,
    SET_ERROR: (state, payload) => state.error = payload,
    ADD_CONTROLLER: (state, payload) => state.controller = payload,
    REMOVE_CONTROLLER: (state) => state.controller = false
  },
  actions: {
    fetch({ state, commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      const controller = new AbortController()
      commit('ADD_CONTROLLER', controller)

      this.$api.get('search/all', state.filters, controller.signal)
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
    clear({ commit, state }) {
      if (state.controller)
        state.controller.abort()
      commit('REMOVE_CONTROLLER')
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
    hasFilters() {
      return false
    },
    emptyData(state) {
      return (
        state.data.entries.length + state.data.users.length + state.data.comments.length + state.data.tags.length + state.data.feeds.length
      ) == 0
    },
    emptyQuery(state) {
      return state.filters.query === ''
    },
    searching(state) {
      return state.filters.query != ''
    }
  }
}


export default {
  namespaced: true,
  modules: {
    all: all,
    users: createSearchModule('search/users'),
    tags: createSearchModule('search/tags'),
    entries: createSearchModule('search/entries'),
    comments: createSearchModule('search/comments'),
    feeds: createSearchModule('search/feeds')
  }
}
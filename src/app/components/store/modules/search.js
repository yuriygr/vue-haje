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

      loading: false,
      error: false
    }
  },
  mutations: {
    // DATA
    'SET_DATA'(state, payload) {
      state.data = payload
    },
    'CLEAR_DATA'(state) {
      state.data = {
        users: [],
        entries: [],
        comments: [],
        tags: [],
        feeds: []
      }
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
    fetch({ state, commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', false)

      this.$api.get('search/all', state.filters)
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
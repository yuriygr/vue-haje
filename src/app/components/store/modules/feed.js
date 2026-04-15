import { createItemModule, createListedModule } from '@/app/components/store/factory'

let feeds = createListedModule('feed/feeds')

let timeline = createListedModule('feed/timeline')

let abyss = createListedModule('feed/abyss')

let custom = {
  ...createItemModule(uuid => `feed/${uuid}`),
  modules: {
    entries: createListedModule(
      (rootState) => `feed/${rootState.feed.custom.data.uuid}/entries`
    ),
    tags: createListedModule(
      (rootState) => `feed/${rootState.feed.custom.data.uuid}/tags`
    )
  }
}

export default {
  namespaced: true,
  modules: { timeline, abyss, feeds, custom },
  state() {
    return {
      data: [],
      hasMore: false,
      
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
    'SET_HAS_MORE'(state, payload) {
      state.hasMore = payload
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
        commit('SET_HAS_MORE', result.has_more)
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
      commit('SET_HAS_MORE', false)
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
    hasMoreItems: state => state.hasMore,
  }
}
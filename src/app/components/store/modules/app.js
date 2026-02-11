/**
 * Основной компонент приложения, который я планирую реиспользовать в других пет-проектах.
 * Данные по умолчанию берутся из файла окружения
 * 
 * @version 1.0.1
 */
export default {
  namespaced: true,
  state() {
    return {
      title:    process.env.VUE_APP_TITLE,
      basePath: process.env.VUE_APP_BASE_URL,
      theme:    process.env.VUE_APP_DEFAULT_THEME,
      density:  process.env.VUE_APP_DEFAULT_DENSITY,
      locale:   process.env.VUE_APP_I18N_LOCALE,
      version:  process.env.PACKAGE_VERSION,

      skeletons: [...Array(15).keys()],
      skeletons_min: [...Array(5).keys()],

      loading: false,
      error: {},

      cachedComponents: [] // Массив для хранения кэшируемых компонентов
    }
  },
  mutations: {
    'SET_THEME'(state, payload) {
      state.theme = payload
    },
    'SET_LOCALE'(state, payload) {
      state.locale = payload
    },
    'SET_DENSITY'(state, payload) {
      state.density = payload
    },
    'SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'SET_ERROR'(state, payload) {
      Object.keys(payload).forEach(key => {
        state.error[key] = payload[key]
      })
    },
    'CLEAN_ERRORS'(state) {
      state.error = {}
    },
    ADD_CACHED_COMPONENT(state, componentName) {
      if (!state.cachedComponents.includes(componentName)) {
        state.cachedComponents.push(componentName)
      }
    },
    REMOVE_CACHED_COMPONENT(state, componentName) {
      state.cachedComponents = state.cachedComponents.filter(
        name => name !== componentName
      )
    },
    RESET_CACHED_COMPONENTS(state) {
      state.cachedComponents = []
    },
  },
  actions: {
    init({ commit, state }) {
      commit('SET_LOCALE',  localStorage.getItem('locale')  || state.locale)
      commit('SET_THEME',   localStorage.getItem('theme')   || state.theme)
      commit('SET_DENSITY', localStorage.getItem('density') || state.density)
    }
  },
  getters: {
    themeStatusBar(state) {
      let colors = []
      colors['black'] = '#111111'
      colors['white'] = '#ffffff'
      return colors[state.theme]
    },
    themes() {
      return [
        'white', 'black'
      ]
    },
    densities() {
      return [
        'compact', 'default', 'spacious'
      ]
    },
    getLoading() {

    },
    getError() {

    }
  }
}
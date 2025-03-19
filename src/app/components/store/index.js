import { createStore } from 'vuex'

// Load modules from folder
const modules = {}
const requireModule = require.context('./modules', false,  /\.js$/)
requireModule.keys().forEach(filename => {
  const moduleName = filename.replace(/(\.\/|\.js)/g, '').replace(/^\w/, c => c.toLowerCase())
  modules[moduleName] = requireModule(filename).default || requireModule(filename)
})

// Create store
const store = createStore({
  modules,
  actions: {
    initApplication({ dispatch }) {
      Object.keys(modules).forEach(moduleName => {
        let action = `${moduleName}/init`
        this._actions[action] && dispatch(action)
      })
    }
  }
})

store.subscribe((mutation, state) => {
  mutation.type == "auth/SET_DATA" && localStorage.setItem('auth', JSON.stringify(mutation.payload))
  mutation.type == "app/SET_THEME" && localStorage.setItem('theme', mutation.payload)
  mutation.type == "app/SET_LOCALE" && localStorage.setItem('locale', mutation.payload)
  mutation.type == "app/TOGGLE_THEME" && localStorage.setItem('theme', state.app.theme)
})

export default store

import { createApp } from 'vue'

import '@/registerServiceWorker'

import App from '@/App.vue'

// app components & services
import Norma from '@/app/index.js'

// some styles
import '@/assets/scss/main.scss'
import '@vue-norma/ui/styles'

createApp(App)
  .use(Norma)
  .mount('#app')
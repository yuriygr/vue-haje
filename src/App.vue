<template>
  <app-layout>
    <app-tabbar />
    <app-content />
  </app-layout>

  <alerts-layer />
  <modals-layer />
  <popover-layer />

  <icons-sprite-layer :path="iconsSpritePath" />
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { AlertsLayer, IconsSpriteLayer, ModalsLayer, PopoverLayer } from '@vue-norma/ui'

import { AppTabbar, AppContent, AppLayout } from '@/components/_app'
import { useSSE } from '@/app/composables/useSSE'
import { useModals } from '@vue-norma/ui'
import { useAppStore } from '@/app/components/stores/modules/app'
import { useAuthStore } from '@/app/components/stores/modules/auth'

export default {
  name: 'app',
  components: {
    AlertsLayer, IconsSpriteLayer, ModalsLayer, PopoverLayer,
    AppTabbar, AppContent, AppLayout
  },
  data() {
    return {
      iconsSpritePath: require('@/assets/symbols.svg'),
      modal: false
    }
  },
  setup() {
    const authStore = useAuthStore()
    const appStore = useAppStore()
    const modals = useModals()
    
    const sse = useSSE(process.env.VUE_APP_SSE_ENDPOINT)

    sse.on('has_notice', authStore.hasNotice)

    const handleSpoilerClick = (e) => {
      if (e.target.classList.contains('spoiler')) {
        e.target.classList.toggle('revealed')
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleSpoilerClick)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleSpoilerClick)
    })

    return { sse, authStore, appStore, modals }
  },
  computed: {
    locale()         { return this.appStore.locale },
    theme()          { return this.appStore.theme },
    density()        { return this.appStore.density },
    themeStatusBar() { return this.appStore.themeStatusBar },

    hasNewNotifications() { return this.authStore.hasNewNotifications },
  },
  methods: {
    setModal(state = false) {
     this.changeDataset('modal', state ? 'on' : false)
    }, 
    setLocale(state = false) {
      this.$i18n.locale = state
      this.changeDataset('locale', state || false)

      if (state) {
        document.documentElement.setAttribute('lang', state)
      } else {
        document.documentElement.removeAttribute('lang')
      }
    },
    setTheme(state = false) {
      this.changeDataset('theme', state)
      this.changeMeta('theme-color', this.themeStatusBar)
    }, 
    setDensity(state = false) {
      this.changeDataset('density', state)
    }, 
    setLayout(state = false) {
      this.changeDataset('layout', state ?? false)
    },
    updateFavicon(state) {
      const favicon = document.querySelector('link[rel="icon"]')
      favicon.href = state 
        ? '/icons/favicon-alert.ico'
        : '/icons/favicon.ico'
    }
  },
  async mounted() {
    this.modals.on('show', _ => this.modal = true)
    this.modals.on('close', _ => this.modal = false)

    try {
      await this.authStore.fetch()
    } catch (error) {
      this.$alerts.danger({ text: this.$t('errors.init_failed') })
      console.error('[App] Init failed:', error)
    }
  },
  beforeUnmount() {
    this.modals.off('show')
    this.modals.off('close')
  },
  watch: {
    modal: {
      handler: 'setModal',
      immediate: true
    },
    locale: {
      handler: 'setLocale',
      immediate: true
    },
    theme: {
      handler: 'setTheme',
      immediate: true
    },
    density: {
      handler: 'setDensity',
      immediate: true
    },
    '$route.meta.layout': {
      handler: 'setLayout',
      immediate: true
    },
    hasNewNotifications: {
      handler: 'updateFavicon',
      immediate: true
    }
  }
}
</script>
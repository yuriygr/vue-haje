<template>
  <app-layout>
    <app-tabbar />
    <app-content />
  </app-layout>

  <toast-layer />
  <modals-layer />
  <popover-layer />

  <icons-sprite-layer :path="iconsSpritePath" />
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { IconsSpriteLayer, ModalsLayer, PopoverLayer } from '@vue-norma/ui'
import { useI18n } from 'vue-i18n'

import { AppTabbar, AppContent, AppLayout } from '@/components/_app'
import { applyMeta, applyDataset } from '@/app/composables/useMeta'
import { useSSE } from '@/app/composables/useSSE'
import { useModals } from '@vue-norma/ui'
import { useToast } from '@/app/composables/useToast'
import { useAppStore } from '@/app/store/modules/app'
import { useAuthStore } from '@/app/store/modules/auth'

export default {
  name: 'app',
  components: {
    IconsSpriteLayer, ModalsLayer, PopoverLayer,
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
    const toast = useToast()
    const { t } = useI18n()
    
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

    return { t, sse, toast, authStore, appStore, modals }
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
     applyDataset('modal', state ? 'on' : false)
    }, 
    setLocale(state = false) {
      this.$i18n.locale = state
      applyDataset('locale', state || false)

      if (state) {
        document.documentElement.setAttribute('lang', state)
      } else {
        document.documentElement.removeAttribute('lang')
      }
    },
    setTheme(state = false) {
      applyDataset('theme', state)
      applyMeta('theme-color', this.themeStatusBar)
    }, 
    setDensity(state = false) {
      applyDataset('density', state)
    }, 
    setLayout(state = false) {
      applyDataset('layout', state ?? false)
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
      this.toast.danger(this.t('errors.init_failed'))
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
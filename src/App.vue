<template>
  <app-layout>
    <app-tabbar />
    <app-content />
  </app-layout>

  <alerts-layer />
  <modals-layer />
  <loading-layer :loading="loading" />
  <popover-layer />

  <icons-sprite-layer :path="iconsSpritePath" />
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { AlertsLayer, IconsSpriteLayer, LoadingLayer, ModalsLayer, PopoverLayer } from '@vue-norma/ui'

import { AppTabbar, AppContent, AppLayout } from '@/components/_app'

export default {
  name: 'app',
  components: {
    AlertsLayer, IconsSpriteLayer, LoadingLayer, ModalsLayer, PopoverLayer,
    AppTabbar, AppContent, AppLayout
  },
  data() {
    return {
      iconsSpritePath: require('@/assets/symbols.svg'),
      modal: false
    }
  },
  computed: {
    ...mapState('app', [ 'locale', 'theme', 'density', 'loading' ]),
    ...mapState('auth', [ 'data' ]),
    ...mapGetters('app', [ 'themeStatusBar' ]),
    ...mapGetters('auth', [ 'isAuth', 'hasNewNotifications' ])
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
    this.$sse.on('has_notice', payload => {
      this.$store.dispatch('auth/has_notice', payload)
    })

    this.$modals.on('show', _ => this.modal = true)
    this.$modals.on('close', _ => this.modal = false)

    try {
      await Promise.all([
        this.$store.dispatch('initApplication'),
        this.$store.dispatch('auth/fetch')
      ])
    } catch (error) {
      this.$alerts.danger({ text: this.$t('errors.init_failed') })
      console.error('[App] Init failed:', error)
    }
  },
  beforeUnmount() {
    this.$sse.off('has_notice')

    this.$modals.off('show')
    this.$modals.off('close')
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
      immediate: false
    }
  }
}
</script>
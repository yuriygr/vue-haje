<template>
  <app-layout>
    <app-tabbar />
    <app-content />
  </app-layout>

  <alerts-layer />
  <modals-layer />
  <loading-layer :loading="loading" />
  <popover-layer />

  <icons-sprite-layer :path="require('@/assets/symbols.svg')" />
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
      modal: false
    }
  },
  computed: {
    ...mapState('app', [ 'locale', 'theme', 'density', 'loading', 'cachedComponents' ]),
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
      this.changeDataset('locale', state ? state : false)
      document.documentElement.setAttribute('lang', state ? state : false);
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
  mounted() {
    this.$store.dispatch('initApplication')
    this.$store.dispatch('auth/fetch')
  },
  created() {
    this.$sse.on('has_notice', (e) => {
      this.$store.dispatch('auth/has_notice', e)
    })

    this.$modals.on('show', _ => this.modal = true)
    this.$modals.on('close', _ => this.modal = false)
  },
  beforeDestroy() {
    this.$sse.off('has_notice')

    this.$modals.off('show')
    this.$modals.off('close')
  },
  watch: {
    modal: {
      handler(to) {
        this.setModal(to)
      },
      immediate: true
    },
    locale: {
      handler(to) {
        this.setLocale(to)
      },
      immediate: true
    },
    theme: {
      handler(to) {
        this.setTheme(to)
      },
      immediate: true
    },
    density: {
      handler(to) {
        this.setDensity(to)
      },
      immediate: true
    },
    '$route.meta.layout': {
      handler(to) {
        this.setLayout(to)
      },
      immediate: true
    },
    hasNewNotifications: {
      handler(to) {
        this.updateFavicon(to)
      },
      immediate: false
    }
  }
}
</script>
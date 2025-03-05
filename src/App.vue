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
      modal: false,
    }
  },
  computed: {
    ...mapState('app', [ 'locale', 'theme', 'loading' ]),
    ...mapState('auth', [ 'data' ]),
    ...mapGetters('app', [ 'themeStatusBar' ])
  },
  methods: {
    setModal(state = false) {
     this.changeDataset('modal', state ? 'on' : false)
    }, 
    setLocale(state = false) {
      this.$i18n.locale = state
      this.changeDataset('locale', state ? state : false)
      document.documentElement.setAttribute("lang", state ? state : false);
    }, 
    setTheme(state = false) {
      this.changeDataset('theme', state)
      this.changeMeta('theme-color', this.themeStatusBar)
    }, 
    setLayout(state = false) {
      this.changeDataset('layout', state ?? false)
    }, 
    setSSEHandlers() {

    }
  },
  mounted() {
    this.$store.dispatch('initApplication')
    this.$store.dispatch('auth/fetch')

    this.setModal(this.modal)
    this.setLocale(this.locale)
    this.setTheme(this.theme)
    this.setLayout(this.$route.meta.layout)
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
    modal(to) {
      this.setModal(to)
    },
    locale(to) {
      this.setLocale(to)
    },
    theme(to) {
      this.setTheme(to)
    },
    '$route.meta.layout'(to) {
      this.setLayout(to)
    }
  }
}
</script>
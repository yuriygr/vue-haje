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
    ...mapState('app', [ 'theme', 'loading' ]),
    ...mapState('auth', [ 'data' ]),
    ...mapGetters('app', [ 'themeStatusBar' ])
  },
  methods: {

  },
  mounted() {
    this.$store.dispatch('initApplication')
    this.$store.dispatch('auth/fetch')

    this.changeDataset('layout', this.$route.meta.layout ?? false)
    this.changeDataset('modal', this.modal ? 'on' : false)
    this.changeDataset('theme', this.theme)
    this.changeMeta('theme-color', this.themeStatusBar)
  },
  created() {
    this.$modals.on('show', _ => this.modal = true)
    this.$modals.on('close', _ => this.modal = false)
  },
  watch: {
    modal(to) {
      this.changeDataset('modal', to ? 'on' : false)
    },
    theme(to) {
      this.changeDataset('theme', to)
      this.changeMeta('theme-color', this.themeStatusBar)
    },
    '$route.meta.layout'(to) {
      this.changeDataset('layout', to ?? false)
    }
  }
}
</script>
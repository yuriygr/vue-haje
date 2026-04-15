import { defineStore } from 'pinia'
import { to } from '@/app/services/utilities'

export const createItemStore = (storeId, endpointBuilder) => defineStore(storeId, {
  state: () => ({
    data: {},
    loading: false,
    error: null,
    controller: null
  }),

  getters: {
    isEmpty: state => Object.keys(state.data).length === 0
  },

  actions: {
    preFetch(payload) {
      this.data = payload
    },

    async fetch(prop = '') {
      this.loading = true
      this.error = null

      const controller = new AbortController()
      this.controller = controller

      const endpoint = typeof endpointBuilder === 'function'
        ? endpointBuilder(prop)
        : `${endpointBuilder}/${prop}`

      const [error, result] = await to(
        this.$api.get(endpoint, false, controller.signal)
      )

      if (error) {
        if (!controller.signal.aborted) this.error = error
      } else {
        this.data = result
      }

      this.controller = null
      this.loading = false
    },

    clear() {
      this.controller?.abort()
      this.$patch({
        controller: null,
        data: {},
        loading: false,
        error: null
      })
    }
  }
})

export const createListStore = (storeId, endpointBuilder, initialFilters = {}) => defineStore(storeId, {
  state: () => ({
    data: [],
    hasMore: false,

    filters: Object.assign({}, initialFilters),

    loading: false,
    error: null,
    controller: null
  }),

  getters: {
    hasMoreItems: state => state.hasMore
  },

  actions: {
    async fetch(prop = '', initial = true) {
      this.loading = true
      this.error = null

      const controller = new AbortController()
      this.controller = controller

      const endpoint = typeof endpointBuilder === 'function'
        ? endpointBuilder(prop)
        : endpointBuilder

      const [error, result] = await to(
        this.$api.get(endpoint, this.filters, controller.signal)
      )

      if (error) {
        if (!controller.signal.aborted) this.error = error
      } else {
        initial
          ? this.data = result.items
          : this.data.push(...result.items)
        this.hasMore = result.has_more
      }

      this.controller = null
      this.loading = false
    },

    async more(prop) {
      this.filters = { ...this.filters, offset: this.data.length }
      await this.fetch(prop, false)
    },

    clear() {
      this.controller?.abort()
      this.$patch({
        controller: null,
        data: [],
        hasMore: false,
        filters: Object.assign({}, initialFilters),
        loading: false,
        error: null
      })
    },

    setFilters(payload) {
      this.filters = { ...this.filters, ...payload }
    },

    clearFilters() {
      this.filters = Object.assign({}, initialFilters)
    }
  }
})
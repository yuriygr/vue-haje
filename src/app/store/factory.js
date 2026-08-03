import { defineStore } from 'pinia'
import { to } from '@/app/services/utilities'

export const createItemStore = (storeId, endpointBuilder, initialData = {}, initialFilters = {}) => defineStore(storeId, {
  state: () => ({
    data: Object.assign({}, initialData),
    filters: Object.assign({}, initialFilters),
    ignoredFilterKeys: ['offset', 'query'],

    loading: false,
    error: null,
    controller: null
  }),

  getters: {
    isEmpty: state => Object.keys(state.data).length === 0,
    hasFilters: state => Object.entries(state.filters).some(([key, value]) => {
      if (state.ignoredFilterKeys.includes(key)) return false

      const initialValue = initialFilters[key]

      if (Array.isArray(value)) {
        return value.length > 0 &&
          JSON.stringify(value) !== JSON.stringify(initialValue ?? [])
      }

      return value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== initialValue
    })
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
        this.$api.get(endpoint, this.filters, controller.signal)
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
      this.data       = JSON.parse(JSON.stringify(initialData))
      this.filters    = JSON.parse(JSON.stringify(initialFilters))
      this.loading    = false
      this.error      = null
      this.controller = null
    },

    // ─── Filters ─────────────────────────────────────────────────────────────────

    setFilters(payload) {
      this.filters = { ...this.filters, ...payload }
    },

    clearFilters() {
      this.filters = Object.assign({}, initialFilters)
    }
  }
})

export const createListStore = (storeId, endpointBuilder, initialFilters = {}, initialData = []) => defineStore(storeId, {
  state: () => ({
    data: Object.assign([], initialData),
    hasMore: false,

    filters: Object.assign({}, initialFilters),
    ignoredFilterKeys: ['offset', 'query'],

    loading: false,
    error: null,
    controller: null
  }),

  getters: {
    hasMoreItems: state => state.hasMore,
    hasFilters: state => Object.entries(state.filters).some(([key, value]) => {
      if (state.ignoredFilterKeys.includes(key)) return false

      const initialValue = initialFilters[key]

      if (Array.isArray(value)) {
        return value.length > 0 &&
          JSON.stringify(value) !== JSON.stringify(initialValue ?? [])
      }

      return value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== initialValue
    })
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

    async refresh(prop) {
      this.filters = { ...this.filters, offset: 0 }
      await this.fetch(prop, true)
    },

    async more(prop) {
      this.filters = { ...this.filters, offset: this.data.length }
      await this.fetch(prop, false)
    },

    clear() {
      this.controller?.abort()
      this.data       = JSON.parse(JSON.stringify(initialData))
      this.filters    = JSON.parse(JSON.stringify(initialFilters))
      this.loading    = false
      this.error      = null
      this.controller = null
    },

    // ─── Filters ─────────────────────────────────────────────────────────────────

    setFilters(payload) {
      this.filters = { ...this.filters, ...payload }
    },

    clearFilters() {
      this.filters = Object.assign({}, initialFilters)
    }
  }
})

export const extendStore = (useStore, extensions) => () => {
  const store = useStore()
  return Object.assign(store, extensions(store))
}
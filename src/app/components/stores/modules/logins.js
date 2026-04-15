import { defineStore } from 'pinia'
import { to } from '@/app/services/utilities'

const initialFilters = { offset: 0 }

export const useLoginsStore = defineStore('logins', {
  state: () => ({
    data: [],
    hasMore: false,
    
    filters: Object.assign({}, initialFilters),

    loading: false,
    error: null,
    controller: null
  }),

  getters: {
    hasMoreItems: state => state.hasMore,
  },

  actions: {
    async fetch(initial = true) {
      this.loading = true
      this.error = null

      const controller = new AbortController()
      this.controller = controller

      const [error, result] = await to(
        this.$api.get('settings/logins', this.filters, controller.signal)
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

    async more() {
      this.filters = { ...this.filters, offset: this.data.length }
      await this.fetch(false)
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

    // --- Filters ---

    setFilters(payload) {
      this.filters = { ...this.filters, ...payload }
    },

    clearFilters() {
      this.filters = Object.assign({}, initialFilters)
    },

    // --- Other ---

    async revokeSession(loginId) {
      const [error] = await to(
        this.$api.delete(`settings/logins/${loginId}`)
      )
      if (error) throw error
    
      this.data = this.data.filter(item => item.login_id !== loginId)
      this.hasMore -= 1
      return null
    }
  }
})
import { defineStore } from 'pinia'
import { to } from '@/app/services/utilities'

const initialFilters = { tab: '', offset: 0 }

export const useNotificationsStore = defineStore('notifications', {
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
        this.$api.get('my/notifications', this.filters, controller.signal)
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

    async readAll() {
      const [error, result] = await to(
        this.$api.post('my/notifications/read', { mode: 'all' })
      )
      if (error) throw error
    
      this.data.forEach(item => item.state.is_readed = true)
      return result
    },
    
    async seen() {
      const [error, result] = await to(
        this.$api.post('my/notifications/seen')
      )
      if (error) throw error

      return result
    },
    
    async read(notifyId) {
      const item = this.data.find(n => n.notify_id === notifyId)
      if (!item || item.state.is_readed) return
    
      item.state.is_readed = true
    
      const [error, result] = await to(
        this.$api.post(`my/notifications/${notifyId}/read`)
      )
      if (error) {
        item.state.is_readed = false
        throw error
      }
      return result
    },

    async hide(notifyId) {
      const item = this.data.find(n => n.notify_id === notifyId)
      if (!item || item.state.is_hidden) return

      item.state.is_hidden = true
    
      const [error, result] = await to(
        this.$api.post(`my/notifications/${notifyId}/hide`)
      )
      if (error) {
        item.state.is_hidden = false
        throw error
      }
      return result
    }
  }
})
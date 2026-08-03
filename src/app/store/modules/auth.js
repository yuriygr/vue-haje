import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const initialData = {
  is_auth: false,
  user: {
    state: {
      has_new_notifications: false
    }
  }
}

export const useAuthStore = defineStore('auth', () => {
  // ─── State ───────────────────────────────────────────────────────────────────

  const data    = ref(JSON.parse(localStorage.getItem('auth')) || { ...initialData })
  const loading = ref(false)
  const error   = ref(false)

  // ─── Persist ─────────────────────────────────────────────────────────────────

  watch(data, val => localStorage.setItem('auth', JSON.stringify(val)), { deep: true })

  // ─── Getters ─────────────────────────────────────────────────────────────────

  const isAuth = computed(() => data.value.is_auth)

  const hasNewNotifications = computed(() =>
    data.value.user?.state.has_new_notifications ?? false
  )

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async function fetch() {
    loading.value = true
    error.value   = false

    try {
      data.value = await this.$api.get('auth/session')
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  function set(payload) {
    data.value = payload
  }

  function seenNotifications() {
    data.value.user.state.has_new_notifications = 0
  }

  function hasNotice(payload) {
    data.value.user.state.has_new_notifications = payload
  }

  return {
    // state
    data, loading, error,
    // getters
    isAuth, hasNewNotifications,
    // actions
    fetch, set, seenNotifications, hasNotice
  }
})
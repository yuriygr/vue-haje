<template>
  <placeholder-loading />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PlaceholderLoading } from '@vue-norma/ui'

import { useAuthStore } from '@/app/store/modules/auth'
import { useApi } from '@/app/composables/useApi'

defineOptions({
  name: 'auth-logout'
})

// Composables
const router = useRouter()
const route = useRoute()
const api = useApi()
const authStore = useAuthStore()

// State
const loading = ref(false)
const error = ref(null)

// Methods
function logout() {
  loading.value = true
  error.value = null

  api.post('auth/logout', { logout_hash: authStore.data.logout_hash })
  .then(async () => {
    await authStore.fetch()
    router.push(route.query.redirect || { name: 'home' })
  })
  .catch(err => {
    error.value = err
  })
  .finally(() => loading.value = false)
}
// Lifecycle hooks
onMounted(() => logout())
</script>
<template>
  <placeholder-loading />
</template>

<script>
import { PlaceholderLoading } from '@vue-norma/ui'
import { useAuthStore } from '@/app/components/stores/modules/auth'

export default {
  name: 'auth-logout',
  components: {
    PlaceholderLoading
  },
  setup() {
    const authStore = useAuthStore()

    return { authStore }
  },
  computed: {
    authData() { return this.authStore.data },
  },
  methods: {
    logout() {
      this.loading = true
      this.error = false

      this.$api.post('auth/logout', { logout_hash: this.authData.logout_hash })
      .then(result => {
        this.authStore.fetch()
        this.$router.push(this.$route.query.redirect || { name: 'home' })
      })
      .catch(error => {
        this.error = error
      })
      .finally(_ => this.loading = false)
    }
  },
  watch: {},
  mounted() {
    this.logout()
  }
}
</script>
